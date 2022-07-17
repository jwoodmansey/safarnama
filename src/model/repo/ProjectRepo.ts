import { ProjectData } from '@common/project';
import { Project } from '../schema/Project';
import { Repository } from './Repository';

export class ProjectRepo extends Repository<typeof Project, ProjectData> {
  constructor() {
    super(Project);
  }

  // In the future we may change this to have private projects,
  // but for now all users can access all projects
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAllForUser(_: string): Promise<ProjectData[]> {
    return this.findAll();
    // return Project.find({"members.userId": userId}).lean()
  }
}
