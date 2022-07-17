import { ExperienceData } from '@common/experience';
import { MediaDocument } from '@common/media';
import { Request, Response } from 'express';
// @ts-ignore
import * as filepreview from 'filepreview';
import { environment } from '../config/env';
import { MediaRepo } from '../model/repo/MediaRepo';
import EntityNotFoundError from '../model/repo/EntityNotFound';
import UploadedFileExtended from '../types/UploadedFileExtended';
import { checkOwner, selectUserId } from '../utils/auth';
import { makeDirectoryIfNotExists } from '../utils/file';

const MEDIA_DIRECTORY = environment.api.mediaDir;

function createMediaPathIfNotExists(ownerId: string): void {
  makeDirectoryIfNotExists(MEDIA_DIRECTORY);
  makeDirectoryIfNotExists(`${MEDIA_DIRECTORY}/${ownerId}`);
}

function getExtension(file: UploadedFileExtended): string {
  // There seems to be a bug with filepond which is making .html/jpeg
  // files come out as .tml/.peg, 4 letter extensions arent parsed right?
  let ext = file.name.split('.').pop();
  if (ext === 'tml') {
    ext = 'html';
  } else if (ext === 'peg') {
    ext = 'jpeg';
  }

  if (!ext) {
    throw new Error('File has no extension');
  }
  return ext;
}

function getPathForMedia(ownerId: string, mediaId: string, ext: string): string {
  return `${MEDIA_DIRECTORY}/${ownerId}/${mediaId}.${ext}`;
}

function getPathForMediaThumb(ownerId: string, mediaId: string): string {
  return `${MEDIA_DIRECTORY}/${ownerId}/${mediaId}_thumb.png`;
}

// Since we only store the file extension in the database
// the rest of the path must be generated each time
// this allows the server to run in any set up without modding the data
export function loadRealPaths(media: MediaDocument[]): MediaDocument[] {
  return media.map((mediaItem) => (mediaItem ? {
    ...mediaItem,
    path: `${environment.api.publicUrl}/storage/${getPathForMedia(mediaItem.ownerId, mediaItem._id, mediaItem.path)}`,
    thumbPath:
      `${environment.api.publicUrl}/storage/${getPathForMediaThumb(mediaItem.ownerId, mediaItem._id)}`,
  } : mediaItem));
}

export async function isCollaboratingOnAnExperience(
  request: Request,
  media: MediaDocument,
): Promise<boolean> {
  console.log('Checking collaborator');
  const exps = (media.associatedExperiences as any) as ExperienceData[];
  // Allow the experience owner or any collaborator to edit this media item
  return exps.find(
    (exp) => selectUserId(request) === exp.ownerId || (
      exp.collaborators !== undefined && exp.collaborators.includes(selectUserId(request))
    ) !== undefined,
  ) !== undefined;
}

export async function processUpload(request: Request, response: Response) {
  if (!request.files || Object.keys(request.files).length === 0
    || !request.files.filepond || Object.keys(request.files.filepond).length === 0) {
    return response.status(400).send({ code: 400, error: 'No files were uploaded.' });
  }

  try {
    const filesOrFile = request.files.filepond;
    if (Array.isArray(filesOrFile)) {
      // const arr = filesOrFile
      // todo multi upload support
    } else {
      const repo = new MediaRepo();
      const file: UploadedFileExtended = filesOrFile as UploadedFileExtended;
      const ext = getExtension(file);
      const ownerId = selectUserId(request);
      const mediaDoc = await repo.add({
        ownerId,
        path: ext,
        thumbPath: ext,
        size: file.size,
        mimetype: file.mimetype,
        md5: file.md5 as string,
        _id: undefined,
        associatedExperiences: typeof request.query.expId === 'string' ? [request.query.expId] : undefined,
      });
      console.log('New media added to database', mediaDoc._id);
      const filePath = getPathForMedia(ownerId, mediaDoc._id, ext);
      const thumbPath = getPathForMediaThumb(ownerId, mediaDoc._id);

      createMediaPathIfNotExists(ownerId);

      console.log('Going to move to path', filePath);
      file.mv(filePath, async (e) => {
        if (e) {
          console.error(e);
          await repo.remove(mediaDoc._id);
        }
        filepreview.generate(
          filePath,
          thumbPath,

          (error: any) => {
            if (error) {
              return console.log(error);
            }
            console.log(`File preview is${thumbPath}`);
            return undefined;
          },
        );
        return response.send(mediaDoc._id);
      });
    }
    return undefined;
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function editMedia(request: Request, response: Response) {
  try {
    const repo = new MediaRepo();
    console.log('Media edit request', request.body, request.files);
    const id = request.params.mediaId;
    const media = await repo.findByIdOrThrow(id);
    if (!checkOwner(request, media) && !isCollaboratingOnAnExperience(request, media)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Media Item' },
      );
    }
    if (request.files && Object.keys(request.files).length > 0
      && request.files.filepond && Object.keys(request.files.filepond).length > 0) {
      const file: UploadedFileExtended = request.files.filepond as UploadedFileExtended;
      const ext = getExtension(file);
      const ownerId = selectUserId(request);
      const filePath = getPathForMedia(ownerId, id, ext);
      console.log('Going to move to path', filePath);
      file.mv(filePath, async (e) => {
        if (e) {
          return response.status(500).send('File not found');
        }
        return response.json({});
      });
    } else {
      const resp = await repo.edit(id, { ...request.body });
      return response.json({ ...resp });
    }
    return undefined;
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'Media item not found' });
    }
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function deleteMedia(request: Request, response: Response) {
  const repo = new MediaRepo();
  try {
    console.log('Media delete request', request.body);
    const id = request.params.mediaId;
    const media = await repo.findByIdOrThrow(id);
    if (media === null) {
      return response.status(404).json({ error: 'Media item not found' });
    }
    if (!checkOwner(request, media)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Media Item' },
      );
    }
    // Todo delete the file
    await repo.remove(id);
    return response.json({ success: true });
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'Media item not found' });
    }
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function getMine(request: Request, response: Response) {
  const repo = new MediaRepo();
  try {
    const media = await repo.getAllByUser(selectUserId(request));
    const parsedMedia = loadRealPaths(media);
    return response.json(parsedMedia);
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}
