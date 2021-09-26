import { ProjectData } from "@common/project";
import { Request, Response } from "express";
import { ProjectRepo } from "../model/repo/ProjectRepo";
import { UserRepo } from "../model/repo/UserRepo";
import { selectUserId } from "../utils/auth";

const repo = new ProjectRepo()

export async function getAllMyProjects(request: Request, response: Response) {
  const data: ProjectData[] = await repo.getAllForUser(selectUserId(request))
  console.log('Got projects', data)
  return response.json(data)
}

export async function getById(request: Request, response: Response) {
  const data: ProjectData = await repo.getById(request.params.id)
  return response.json(await populateMembers(data))
}

async function populateMembers(data: ProjectData): Promise<ProjectData> {
  //Populate some fields from the user into members, for now we'll only do name.
  const userRepo = new UserRepo()
  const members = await Promise.all(data.members ? data.members.map(m => userRepo.get(m.userId).then((user) => ({
    ...m,
    name: user ? user.displayName : undefined,
  }))) : [])
  return {
    ...data,
    members: members || []
  }
}

export async function setRole(request: Request, response: Response) {
  const updated = await addRoleToProjectMember(request.params.id, request.params.userId, request.params.role)
  return response.json(await populateMembers(updated))
}

export async function addRoleToProjectMember(projectId: string, userId: string, role: string) {
  // Todo this should be transactional
  const project = await repo.getById(projectId)
  if (project.members && project.members.find(m => m.userId.toString() === userId) !== undefined) {
    return repo.edit(projectId, {
      members: project.members ? project.members.map(m => ({
        ...m,
        roles: m.userId.toString() !== userId ? m.roles : m.roles && !m.roles.includes(role) ? m.roles.concat(role) : [role]
      })) : []
    })
  } else {
    return repo.edit(projectId, {
      members: project.members ? project.members.concat({ userId, roles: [role] }) : [{ userId, roles: [role] }]
    })
  }
}

export async function removeRole(request: Request, response: Response) {
  const projectId = request.params.id
  // Todo this should be transactional
  const project = await repo.getById(projectId)
  const updated = await repo.edit(projectId, {
    members: project.members ? project.members.map(m => {
      console.log('m.userId', m.userId, JSON.stringify(m.roles), request.params.role, request.params.userId)
      return ({
        ...m,
        roles: m.userId.toString() !== request.params.userId ? m.roles : m.roles.filter(role => role !== request.params.role)
      });
    }) : []
  })
  return response.json(await populateMembers(updated))
}