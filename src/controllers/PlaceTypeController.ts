import {
  Request,
  Response,
} from 'express';
import * as fs from 'fs';

import { PlaceType } from '@common/point-of-interest';

import { environment } from '../config/env';
import EntityNotFoundError from '../model/repo/EntityNotFound';
import { PlaceTypeRepo } from '../model/repo/PlaceTypeRepo';
import {
  checkOwner,
  selectUserId,
} from '../utils/auth';
import { makeDirectoryIfNotExists } from '../utils/file';

function getPathForIcon(ownerId: string, mediaId: string): string {
  return `${environment.api.iconDir}/${ownerId}/${mediaId}.png`;
}

const repo = new PlaceTypeRepo();
export async function createPlaceType(request: Request, response: Response) {
  const type: PlaceType = {
    ...request.body,
    imageIconURL: request.body.imageIconURL ? true : undefined,
    createdAt: new Date(),
    ownerId: selectUserId(request),
  };
  try {
    const res = await repo.add(type);
    if (!type.ownerId || !res.ownerId) {
      throw new Error(`Missing ownerId for type ${res._id}`);
    }
    const filePath = getPathForIcon(type.ownerId, res._id);
    makeDirectoryIfNotExists(environment.api.iconDir);
    makeDirectoryIfNotExists(`${environment.api.iconDir}/${res.ownerId}`);
    console.log('Going to move to path', filePath);
    if (type.imageIconURL) {
      fs.writeFile(filePath, request.body.imageIconURL.split(';base64,').pop(), { encoding: 'base64' }, async (err) => {
        if (err) {
          console.error(err);
          return response.status(500).json({ code: 500, error: err });
        }
        console.log('File created from base64 icon');
        return response.json({
          ...res,
          imageIconURL: `${environment.api.publicUrl}/storage/${getPathForIcon(res.ownerId!, res._id)}`,
        });
      });
      return undefined;
    }
    return response.json(res);
  } catch (e) {
    return response.status(500).json({ code: 500, error: e });
  }
}

export async function getAllMyPlaceTypes(request: Request, response: Response) {
  const data: PlaceType[] = await repo.getAllByUser(selectUserId(request));
  return response.json(data.map((p) => ({
    ...p,
    imageIconURL: p.imageIconURL && p.ownerId ? `${environment.api.publicUrl}/storage/${getPathForIcon(p.ownerId, p._id)}` : undefined,
  })));
}

export async function deletePlaceType(request: Request, response: Response) {
  const { id } = request.params;
  try {
    const placeType = await repo.findByIdOrThrow(request.params.id);
    if (!checkOwner(request, placeType)) {
      return response.status(401).json(
        { error: 'You do not have permission to delete this PlaceType' },
      );
    }
    await repo.remove(id);
    return response.json({ success: true });
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'PlaceType not found' });
    }
    return response.status(500).json({ code: 500, error: e });
  }
}
