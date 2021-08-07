import { PlaceType } from '@common/point-of-interest'
import { Request, Response } from 'express'
import * as fs from 'fs'
import { environment } from '../config/env'
import { PlaceTypeRepo } from '../model/repo/PlaceTypeRepo'
import { checkOwner } from '../utils/auth'
import { makeDirectoryIfNotExists } from '../utils/file'

export async function createPlaceType(request: Request, response: Response) {
  const repo = new PlaceTypeRepo()
  const type: PlaceType = {
    ...request.body,
    imageIcon: request.body.imageIcon ? true : undefined,
    createdAt: new Date(),
    ownerId: request.user._id,
  }
  try {
    const res = await repo.add(type)
    const filePath = getPathForIcon(type.ownerId, res._id)
    makeDirectoryIfNotExists(environment.api.iconDir)
    makeDirectoryIfNotExists(`${environment.api.iconDir}/${res.ownerId}`)
    console.log('Going to move to path', filePath)
    if (type.imageIcon) {
      fs.writeFile(filePath, request.body.imageIcon.split(';base64,').pop(), { encoding: 'base64' }, async function (err) {
        if (err) {
          console.error(err)
          return response.status(500).json({ code: 500, error: err })
        }
        console.log('File created from base64 icon');
        return response.json({
          ...res,
          imageIcon: `${environment.api.publicUrl}/storage/${getPathForIcon(res.ownerId, res._id)}`
        })
      });
      return
    } else {
      return response.json(res)
    }
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

function getPathForIcon(ownerId: string, mediaId: string): string {
  return `${environment.api.iconDir}/${ownerId}/${mediaId}.png`
}

export async function getAllMyPlaceTypes(request: Request, response: Response) {
  const repo = new PlaceTypeRepo()
  const data: PlaceType[] = await repo.getAllByUser(request.user._id)
  return response.json(data.map(p => ({
    ...p,
    imageIcon: p.imageIcon ? `${environment.api.publicUrl}/storage/${getPathForIcon(p.ownerId, p._id)}` : undefined,
  })))
}

export async function deletePlaceType(request: Request, response: Response) {
  const repo = new PlaceTypeRepo()
  const id = request.params.id
  try {
    const placeType = await repo.getById(request.params.id)
    if (placeType === null) {
      return response.status(404).json({ error: 'PlaceType not found' })
    }
    if (!checkOwner(request, placeType)) {
      return response.status(401).json(
        { error: 'You do not have permission to delete this PlaceType' })
    }
    await repo.delete(id)
    return response.json({ success: true })
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}
