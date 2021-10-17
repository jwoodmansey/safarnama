import { ProjectData } from "@common/project";
import Project = require("../schema/Project");
import { ProjectModel } from "./ProjectModel";
import { Repository } from "./Repository";

export class ProjectRepo extends Repository<ProjectModel, ProjectData> {

  constructor() {
    super(Project)
  }

  // In the future we may change this to have private projects, but for now all users can access all projects
  public async getAllForUser(_: string): Promise<ProjectData[]> {
    return this.findAll()
    // return Project.find({"members.userId": userId}).lean()
  }
}