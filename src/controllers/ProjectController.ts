import { ProjectData } from "@common/project";
import { Request, Response } from "express";
import { ProjectRepo } from "../model/repo/ProjectRepo";

export function createProject() {

}

export async function getAllMyProjects(request: Request, response: Response) {
  const repo = new ProjectRepo()
  const data: ProjectData[] = await repo.getAllForUser(request.user._id)
  console.log('Got projects', data)
  return response.json(data)
}