import { RouteDocument } from '@common/route'
import { RouteRepo } from '../model/repo/RouteRepo'
import { Request, Response } from 'express'
import { checkOwner, selectUserId } from '../utils/auth'
import { EntityNotFoundError } from '../model/repo/Repository'

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
    const route = await repo.findByIdOrThrow(request.params.routeId)
    if (!checkOwner(request, route)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Route' })
    }
    const edited = await repo.edit(request.params.routeId, request.body)
    return response.json(edited)
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'Route not found' })
    }
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function deleteRoute(request: Request, response: Response) {
  try {
    const route = await repo.findByIdOrThrow(request.params.routeId)
    if (!checkOwner(request, route)) {
      return response.status(401).json(
        { error: 'You do not have permission to delete this Route' })
    }
    await repo.remove(request.params.routeId)
    return response.json({ success: true })
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      return response.status(404).json({ error: 'Route not found' })
    }
    return response.status(500).json({ code: 500, error: e })
  }
}
