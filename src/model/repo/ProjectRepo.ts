import { ProjectData } from "@common/project";
import Project = require("../schema/Project");

export class ProjectRepo {

  public async add(project: ProjectData) {
    const data = new Project({ ...project })
    const dbResp = await data.save()
    return dbResp.toJSON()
  }


  public async edit(
    id: string,
    edit: Partial<ProjectData>): Promise<ProjectData> {
    const model = await Project.findById(id)
    console.log('MODEL', JSON.stringify(model))
    if (model) {
      console.log('editing project', JSON.stringify(edit))
      model.set({ ...edit, updatedAt: new Date() })
      const dbResp = await model.save()
      return dbResp.toJSON()
    }
    throw new Error('Could not find project to edit it' + id)
  }

  // In the future we may change this to have private projects, but for now all users can access all projects
  public async getAllForUser(_: string): Promise<ProjectData[]> {
    return Project.find().lean()
    // return Project.find({"members.userId": userId}).lean()
  }

  public async getById(id: string): Promise<ProjectData> {
    return Project.findById(id).lean()
    // return Project.find({"members.userId": userId}).lean()
  }
}