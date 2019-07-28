import { PlaceType } from '@common/point-of-interest'
import { Request, Response } from 'express'
import { PlaceTypeRepo } from '../model/repo/PlaceTypeRepo'

export async function createPlaceType(request: Request, response: Response)  {
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

export async function getAllMyPlaceTypes(request: Request, response: Response)  {
  const repo = new PlaceTypeRepo()
  const data: PlaceType[] = await repo.getAllByUser(request.user._id)
  return response.json(data)
}
