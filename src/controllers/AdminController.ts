import { Member, ProjectData } from '@common/project'
import { UserData } from '@common/user'
import { NextFunction, Request, Response } from 'express'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { ProjectRepo } from '../model/repo/ProjectRepo'
import { UserRepo } from '../model/repo/UserRepo'

export async function getAllUsers(_request: Request, response: Response) {
  const userRepo = new UserRepo()
  const allUsers = await userRepo.findAll()
  return response.json(allUsers.map(user => ({ ...user, token: {} })))
}

export async function getAllPublishedExperiences(request: Request, response: Response) {
  const experienceRepo = new ExperienceRepo()
  const res = await experienceRepo.getAllSnapshots()
  console.log(res)
  if (request.query.projectId) {
    // todo move to repo level
    return response.json(res.filter((snap) => {
      console.log('snap', snap.data !== undefined)
      if (snap.data && snap.data.projects) {
        console.log(request.query.projectId, JSON.stringify(snap.data.projects))
      }
      return snap.projects && snap.projects.find((p: any) => p.toString() === request.query.projectId) !== undefined
    }))
  }
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


export async function ensureAdminOfProjectForExperience(request: Request, response: Response, next: NextFunction) {
  if (!(await isUserAdminOfProjectForExperience(request))) {
    return response.status(401).send()
  }
  return next()
}

async function isUserAdminOfProjectForExperience(request: Request): Promise<boolean> {
  const userData = request.user as UserData
  // Admins can always access admin functions of ANY project
  if (isUserAdmin(request)) {
    return true
  }
  const experienceId = request.params.id
  const experienceRepo = new ExperienceRepo()
  const projectRepo = new ProjectRepo()
  const [experience, projects] = await Promise.all([
    experienceRepo.getModelById(experienceId),
    projectRepo.getAllForUser(userData._id)
  ])
  if (!experience) {
    return false
  }
  return experience.projects ? experience.projects.find(
    (experienceProject: string) => projects.find((p: ProjectData) => experienceProject == p._id &&
      p.members ? p.members.find((m: Member) => m.roles.includes('admin') &&
        m.userId === userData._id
      ) !== undefined : false
    ) !== undefined
  ) !== undefined : false
}
