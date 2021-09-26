import { RouteDocument } from '@common/route'
import { RouteRepo } from '../model/repo/RouteRepo'
import { Request, Response } from 'express'
import { checkOwner, selectUserId } from '../utils/auth'

const repo = new RouteRepo()

export async function createRoute(request: Request, response: Response) {
  const routeData: RouteDocument = {
    ...request.body,
    createdAt: new Date(),
    ownerId: selectUserId(request),
  }
  try {
    const res = await repo.add(routeData)
    return response.json(res)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function editRoute(request: Request, response: Response) {
  try {
    const route = await repo.getModel(request.params.routeId)
    if (route === null) {
      return response.status(404).json({ error: 'Route not found' })
    }
    if (!checkOwner(request, route)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Route' })
    }
    route.set({ ...request.body, updatedAt: new Date() })
    const dbResp = await route.save()
    return response.json(dbResp.toJSON())
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function deleteRoute(request: Request, response: Response) {
  try {
    const route = await repo.getModel(request.params.routeId)
    if (route === null) {
      return response.status(404).json({ error: 'Route not found' })
    }
    if (!checkOwner(request, route)) {
      return response.status(401).json(
        { error: 'You do not have permission to delete this Route' })
    }
    await route.remove()
    return response.json({ success: true })
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}
