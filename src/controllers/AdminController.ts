import { Request, Response, NextFunction } from 'express'
import { UserRepo } from '../model/repo/UserRepo'
import { UserData } from '@common/user'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'

export async function getAllUsers(_request: Request, response: Response) {
  const userRepo = new UserRepo()
  const allUsers = await userRepo.getAll()
  return response.json(allUsers.map(user => ({ ...user, token: {} })))
}

export async function getAllPublishedExperiences(_request: Request, response: Response) {
  const experienceRepo = new ExperienceRepo()
  const res = await experienceRepo.getAllSnapshots()
  console.log(res)
  return response.json(res)
}

export async function featureExperience(request: Request, response: Response) {
  return setFeatured(request, response, true)
}

export async function unFeatureExperience(request: Request, response: Response) {
  return setFeatured(request, response, false)
}

export async function setFeatured(request: Request, response: Response, featured: boolean) {
  const experienceRepo = new ExperienceRepo()
  const experience = await experienceRepo.getLatestSnapshotModelByExperienceId(request.params.id)
  if (experience === null) {
    console.log('Could not find experience with id', request.params.id)
    return response.status(404).send()
  }
  experience.metaData.featured = featured
  if (request.body.tags) {
    experience.metaData.tags = request.body.tags
  }
  const res = await experience.save()
  return response.json(res)
}

export function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  if (!isUserAdmin(request)) {
    return response.status(401).send()
  }
  return next()
}

function isUserAdmin(request: Request): boolean {
  const userData = request.user as UserData
  return userData.roles !== undefined && userData.roles.includes('admin')
}
