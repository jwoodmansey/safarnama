import { MediaDocument } from '@common/media';
import { PointOfInterestDocument } from '@common/point-of-interest';
import { Request, Response } from 'express';
import { loadRealPaths } from './MediaController';
import { ExperienceRepo } from '../model/repo/ExperienceRepo';
import { MediaRepo } from '../model/repo/MediaRepo';
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo';
import { checkOwner, selectUserId } from '../utils/auth';
import EntityNotFoundError from '../model/repo/EntityNotFound';

const repo = new PointOfInterestRepo();
const expRepo = new ExperienceRepo();

function loadRealMediaPaths(poi: PointOfInterestDocument): void {
  if (poi.media) {
    poi.media = loadRealPaths(poi.media);
  }
}

export async function isAnExperienceCollaborator(
  request: Request,
  poi: PointOfInterestDocument,
): Promise<boolean> {
  const experienceRepo = new ExperienceRepo();
  const exp = await experienceRepo.findByIdOrThrow(poi.experienceId);
  if (!exp.collaborators) {
    return false;
  }
  return exp.collaborators.includes(selectUserId(request));
}

export async function createPlace(request: Request, response: Response) {
  const exp = await expRepo.findById(request.body.experienceId);
  if (!exp) {
    return response.status(404).json({ error: 'Place not found' });
  }
  if (!checkOwner(request, exp)
    && !(exp.collaborators && exp.collaborators.includes(selectUserId(request)))
  ) {
    return response.status(401).json(
      { error: 'You do not have permission to add a place to this experience' },
    );
  }

  const poiData: PointOfInterestDocument = {
    ...request.body,
    createdAt: new Date(),
    ownerId: exp.ownerId, // The owner is always the experience creator
  };
  try {
    const res = await repo.add(poiData);
    loadRealMediaPaths(res);
    return response.json(res);
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function editPlace(request: Request, response: Response) {
  const mediaRepo = new MediaRepo();
  try {
    const poi = await repo.findByIdOrThrow(request.params.poiId);
    if (!checkOwner(request, poi) && !(await isAnExperienceCollaborator(request, poi))) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Place' },
      );
    }
    let mediaIds: string[] = [];
    if (request.body.media) {
      mediaIds = request.body.media.map((media: MediaDocument) => media._id);
      delete request.body.media;
    }

    // Mark each media as now associated with this experience
    mediaIds.forEach(async (id) => {
      const media = await mediaRepo.findById(id);
      if (media) {
        if (!media.associatedExperiences) {
          media.associatedExperiences = [];
        }
        if (!media.associatedExperiences.find((thisId) => thisId === id)) {
          if (poi.experienceId) {
            media.associatedExperiences.push(poi.experienceId);
            console.log('Associating experiences with media', media.associatedExperiences);
            await mediaRepo.edit(id, { associatedExperiences: media.associatedExperiences });
          }
        }
      }
    });
    const populated = await repo.edit(poi._id, {
      ...request.body,
      media: mediaIds,
      updatedAt: new Date(),
      ownerId: poi.ownerId, // User cannot change this field!!!
      createdAt: poi.createdAt,
    });
    loadRealMediaPaths(populated);
    return response.json(populated);
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'Place not found' });
    }
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function deletePlace(request: Request, response: Response) {
  try {
    const poi = await repo.findByIdOrThrow(request.params.poiId);
    if (!checkOwner(request, poi) && !(await isAnExperienceCollaborator(request, poi))) {
      return response.status(401).json(
        { error: 'You do not have permission to delete this place' },
      );
    }
    await repo.remove(poi._id);
    return response.json({ success: true });
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'Place not found' });
    }
    return response.status(500).json({ code: 500, error: e });
  }
}
