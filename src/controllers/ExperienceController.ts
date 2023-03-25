import { ExperienceData, ExperienceSnapshotData, PublicProfile } from '@common/experience';
import { MediaDocument } from '@common/media';
import { PointOfInterestDocument } from '@common/point-of-interest';
import { UserData } from '@common/user';
import { Request, Response } from 'express';
import archiver = require('archiver');
import * as fs from 'fs';
import { ExperienceRepo } from '../model/repo/ExperienceRepo';
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo';
import { ProjectRepo } from '../model/repo/ProjectRepo';
import { RouteRepo } from '../model/repo/RouteRepo';
import { UserRepo } from '../model/repo/UserRepo';
import { checkOwner } from '../utils/auth';
import { createFirebaseDynamicLink, DynamicLinkInfo } from './FirebaseDynamicLinkController';
import { getExtension, getPathForMedia, loadRealPaths } from './MediaController';
import { addRoleToProjectMember } from './ProjectController';
import { makeDirectoryIfNotExists } from '../utils/file';

const repo = new ExperienceRepo();
const projectRepo = new ProjectRepo();

function userDataToPublicProfile(userData: UserData[]): PublicProfile[] {
  return userData.map((profile) => ({
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    id: profile._id,
  }));
}

async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

function getTotalSize(media: MediaDocument[]): number {
  if (!media) {
    return 0;
  }
  const done: string[] = [];
  return media.reduce(
    (prev, item) => {
      // Only count each media item once even if it appears multiple places
      if (done.includes(item._id)) {
        return prev;
      }
      done.push(item._id);
      return prev + item.size;
    },
    0,
  );
}

function getTotalSizeForPlaces(places: PointOfInterestDocument[] | undefined): number {
  if (!places) {
    return 0;
  }
  const allMedia: MediaDocument[][] = places.map((place) => place.media);
  return getTotalSize(allMedia.reduce((acc, val) => acc.concat(val), []));
}

export async function createExperience(request: Request, response: Response) {
  const experienceData: ExperienceData = {
    _id: undefined,
    name: request.body.name,
    description: request.body.description,
    createdAt: new Date(),
    ownerId: (request.user as UserData)?._id,
    projects: request.body.projects,
  };

  if (experienceData.projects && experienceData.ownerId) {
    for (const p of experienceData.projects) {
      if (p) {
        // eslint-disable-next-line no-await-in-loop
        await addRoleToProjectMember(p, experienceData.ownerId, 'creator');
      }
    }
  }

  try {
    const res = await repo.add(experienceData);
    return response.json(res);
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function cloneExperience(request: Request, response: Response) {
  const placeRepo = new PointOfInterestRepo();
  const routeRepo = new RouteRepo();
  const newName = request.body.name;
  const id = request.params.experienceId;

  const experience = await repo.getModelById(id);
  if (experience === null) {
    return response.status(404).json({ error: 'Experience not found' });
  }
  if (!checkOwner(request, experience)) {
    return response.status(401).json(
      { error: 'You do not have permission to clone this experience' },
    );
  }
  const newData = await repo.add({ ...experience.toJSON(), name: newName, _id: undefined });
  const places = await placeRepo.findByExperienceId(id);
  const newPlaces = [];
  for (const place of places) {
    // eslint-disable-next-line no-await-in-loop
    const newPlace = await placeRepo.add({
      ...place,
      _id: undefined,
      experienceId: newData._id,
    });
    if (newPlace.media) {
      newPlace.media = loadRealPaths(newPlace.media);
    }
    newPlaces.push(newPlace);
  }
  const routes = await routeRepo.findByExperienceId(id);
  const newRoutes = [];
  for (const route of routes) {
    // eslint-disable-next-line no-await-in-loop
    newRoutes.push(await routeRepo.add({
      ...route,
      _id: undefined,
      experienceId: newData._id,
    }));
  }
  return response.json({
    ...newData,
    routes: newRoutes,
    pointOfInterests: newPlaces,
  });
}

export async function editExperience(request: Request, response: Response) {
  try {
    const experience = await repo.getModelById(request.params.experienceId);
    if (experience === null) {
      return response.status(404).json({ error: 'Experience not found' });
    }
    if (!checkOwner(request, experience)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this experience' },
      );
    }
    experience.name = request.body.name;
    experience.description = request.body.description;
    const dbResp = await experience.save();
    return response.json(dbResp.toJSON());
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function getExperienceSnapshot(request: Request, response: Response) {
  try {
    const snapshot = await repo.getLatestSnapshotByExperienceId(request.params.experienceId);
    if (snapshot?.data.projects && snapshot.data.projects[0]) {
      snapshot.projectData = await projectRepo.findById(snapshot.data.projects[0]);
    }

    if (snapshot === null) {
      return response.status(404).json({ error: 'Experience snapshot not found' });
    }
    return response.json(snapshot);
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function publishExperienceSnapshot(request: Request, response: Response) {
  try {
    const placeRepo = new PointOfInterestRepo();
    const routeRepo = new RouteRepo();

    const experience = await repo.getModelById(request.params.experienceId);
    if (experience === null) {
      return response.status(404).json({ error: 'Experience not found' });
    }
    // TODO this NEEDS to happen atomically
    const prevSnapshot = await repo.getLatestSnapshotByExperienceId(experience._id);
    let version = 1;
    let featured = false;
    let tags: string[] | undefined;
    if (prevSnapshot) {
      version = prevSnapshot.metaData.version + 1;
      featured = prevSnapshot.metaData.featured ? prevSnapshot.metaData.featured : false;
      tags = prevSnapshot.metaData.tags;
    }

    if (!checkOwner(request, experience)) {
      return response.status(401).json(
        { error: 'You do not have permission to publish this experience' },
      );
    }
    const experienceData: ExperienceData = experience.toObject();
    experienceData.pointOfInterests = [];
    experienceData.routes = [];
    experienceData.pointOfInterests = await placeRepo.findByExperienceId(experience._id);
    experienceData.pointOfInterests.forEach((poi) => {
      if (poi.media) {
        poi.media = loadRealPaths(poi.media);
        poi.media = poi.media.map((media) => ({
          ...media,
          placeId: poi._id,
        }));
      }
    });
    experienceData.routes = await routeRepo.findByExperienceId(experience._id);

    // todo work out if we already have a snapshot and get published at date from there?
    // why do we even need to store published at time? can just query for it if ever need

    // Ask firebase for a short url which will become a deeplink
    const projectId = experience.projects ? experience.projects[0] : undefined;
    let dynamicLinkInfo: DynamicLinkInfo | undefined;
    if (projectId) {
      const project = await projectRepo.findById(projectId);
      dynamicLinkInfo = {
        androidInfo: project?.android?.package ? {
          androidPackageName: project?.android?.package,
        } : undefined,
        iosInfo: project?.iOS ? {
          iosAppStoreId: project?.iOS?.appStoreId,
          iosBundleId: project?.iOS?.bundleId,
        } : undefined,
      };
    }
    const shortLink = await createFirebaseDynamicLink(
      `https://safarnama.lancs.ac.uk/download/${experience._id}`,
      dynamicLinkInfo,
    );

    const userRepo = new UserRepo();
    const ownerId = (request.user as UserData)?._id;
    if (!ownerId) {
      throw new Error('User not found');
    }
    const user = await userRepo.findById(ownerId);
    if (!user) {
      throw new Error('User not found');
    }
    const ownerPublicProfile: PublicProfile = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: ownerId,
      bio: user.bio,
    };

    const snapshot: ExperienceSnapshotData = {
      ownerId,
      _id: undefined,
      data: {
        ...experienceData,
      },
      metaData: {
        version,
        shortLink,
        featured,
        tags,
        ownerPublicProfile,
        created_at: new Date(),
        size: getTotalSizeForPlaces(experienceData.pointOfInterests),
      },
    };
    const dbResp = await repo.saveSnapshot(snapshot);

    return response.json(dbResp);
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function unpublishExperience(request: Request, response: Response) {
  try {
    const experience = await repo.getModelById(request.params.experienceId);
    if (experience === null) {
      return response.status(404).json({ error: 'Experience not found' });
    }
    if (!checkOwner(request, experience)) {
      return response.status(401).json(
        { error: 'You do not have permission to publish this experience' },
      );
    }
    repo.deleteAllSanpshotsByExperienceId(experience.id);
    return response.json({ success: true });
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function addCollaboratorsToExperience(request: Request, response: Response) {
  try {
    const experience = await repo.getModelById(request.params.experienceId);
    if (experience === null) {
      return response.status(404).json({ error: 'Experience not found' });
    }
    if (!checkOwner(request, experience)) {
      return response.status(401).json(
        { error: 'You do not have permission to publish this experience' },
      );
    }

    const userRepo = new UserRepo();
    const collaborators: string[] = experience.collaborators ? experience.collaborators : [];
    const profiles: {
      id: string,
      displayName: string,
      photoURL?: string,
    }[] = [];
    await asyncForEach(request.body.userIds, async (userId: string) => {
      const user = await userRepo.findById(userId);
      if (!user) {
        return response.status(403).json({ code: 403, error: `UserId '${userId}' not found` });
      }
      if (!collaborators.includes(userId)) {
        collaborators.push(userId);
      }
      profiles.push({
        id: user._id,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      return undefined;
    });
    experience.collaborators = collaborators;
    await experience.save();
    return response.json({ success: true, users: profiles });
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function removeCollaboratorFromExperience(request: Request, response: Response) {
  const experience = await repo.getModelById(request.params.experienceId);
  if (experience === null) {
    return response.status(404).json({ error: 'Experience not found' });
  }
  if (!checkOwner(request, experience)) {
    return response.status(401).json(
      { error: 'You do not have permission to view collaborators for this experience' },
    );
  }
  const collabIds = experience.collaborators ? [...experience.collaborators] : [];
  console.log('collabIds', JSON.stringify(collabIds), request.params.userId);
  // Ensure these absolutely are strings, might be an ObjectID
  const newArray = collabIds.filter((id) => JSON.stringify(
    request.params.userId,
  ) !== JSON.stringify(id));
  console.log('newArray', JSON.stringify(newArray));
  experience.collaborators = newArray;
  await experience.save();
  const populated = await experience.populate('collaborators');
  const collabs: UserData[] = (populated.collaborators as any);
  return response.json(userDataToPublicProfile(collabs));
}

export async function getCollaboratorsForExperience(request: Request, response: Response) {
  const experience = await repo.getModelById(request.params.experienceId);
  if (experience === null) {
    return response.status(404).json({ error: 'Experience not found' });
  }
  if (!checkOwner(request, experience)) {
    return response.status(401).json(
      { error: 'You do not have permission to view collaborators for this experience' },
    );
  }
  const populated = await experience.populate('collaborators');
  const collabs: UserData[] = (populated.collaborators as any);
  return response.json(userDataToPublicProfile(collabs));
}

export async function exportExperienceData(request: Request, response: Response) {
  try {
    const { experienceId } = request.params;
    const experience = await repo.getModelById(experienceId);
    const snapshot = await repo.getLatestSnapshotByExperienceId(experienceId);
    if (snapshot === null) {
      return response.status(404).json({ error: 'Experience snapshot not found' });
    }

    if (snapshot?.data.projects && snapshot.data.projects[0]) {
      snapshot.projectData = await projectRepo.findById(snapshot.data.projects[0]);
    }
    const outputFile = `exports/${experienceId}.zip`;
    await makeDirectoryIfNotExists('exports');
    const output = fs.createWriteStream(outputFile);
    output.on('finish', () => {
      console.log('completely done!');
      response.download(outputFile);
    });

    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });

    snapshot.data.pointOfInterests?.forEach((place) => {
      place.media.forEach((media) => {
        const ext = getExtension({ name: media.path } as any);
        const mediaPath = getPathForMedia(
          media.ownerId!,
          media._id.toString(),
          ext,
        );
        archive.file(
          mediaPath,
          { name: `media/${media._id.toString()}.${ext}` },
        );
      });
    });
    archive.append(JSON.stringify(snapshot, null, 4), { name: 'snapshot.json' });
    archive.append(JSON.stringify(experience, null, 4), { name: 'experience.json' });
    archive.pipe(output);
    archive.finalize();

    return undefined;
  } catch (e) {
    console.log(e);
    return response.status(500).json({ code: 500, error: e });
  }
}
