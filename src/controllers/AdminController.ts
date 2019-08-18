import { Request, Response } from 'express'
import { UserRepo } from '../model/repo/UserRepo'
import { UserData } from '@common/user'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'

export async function getAllUsers(request: Request, response: Response) {
  if (!isUserAdmin(request)) {
    return response.status(401).send()
  }
  const userRepo = new UserRepo()
  const allUsers = await userRepo.getAll()
  return response.json(allUsers.map(user => ({ ...user, token: {} })))
}

export async function getAllPublishedExperiences(request: Request, response: Response) {
  if (!isUserAdmin(request)) {
    return response.status(401).send()
  }
  const experienceRepo = new ExperienceRepo()
  const res = await experienceRepo.getAllSnapshots()
  console.log(res)
  return response.json(res)
}

function isUserAdmin(request: Request): boolean {
  const userData = request.user as UserData
  return userData.roles !== undefined && userData.roles.includes('admin')
}
