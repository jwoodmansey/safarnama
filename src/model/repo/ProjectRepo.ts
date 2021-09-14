import { ProjectData } from "@common/project";
import Project = require("../schema/Project");

export class ProjectRepo {

  public async add(project: ProjectData) {
    const data = new Project({ ...project })
    const dbResp = await data.save()
    return dbResp.toJSON()
  }

  // In the future we may change this to have private projects, but for now all users can access all projects
  public async getAllForUser(_: string): Promise<ProjectData[]> {
    return Project.find().lean()
    // return Project.find({"members.userId": userId}).lean()
  }

  public async getById(id: string): Promise<ProjectData> {
    return Project.findById(id).populate('members.userId').lean()
    // return Project.find({"members.userId": userId}).lean()
  }
}