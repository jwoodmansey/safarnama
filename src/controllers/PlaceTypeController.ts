import { PlaceType } from '@common/point-of-interest'
import { Request, Response } from 'express'
import { PlaceTypeRepo } from '../model/repo/PlaceTypeRepo'
import { checkOwner } from '../utils/auth'

export async function createPlaceType(request: Request, response: Response) {
  const repo = new PlaceTypeRepo()
  const type: PlaceType = {
    ...request.body,
    createdAt: new Date(),
    ownerId: request.user._id,
  }
  try {
    const res = await repo.add(type)
    return response.json(res)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function getAllMyPlaceTypes(request: Request, response: Response) {
  const repo = new PlaceTypeRepo()
  const data: PlaceType[] = await repo.getAllByUser(request.user._id)
  return response.json(data)
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
