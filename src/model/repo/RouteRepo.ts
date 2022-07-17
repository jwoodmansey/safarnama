import { RouteDocument } from '@common/route';
import { Route } from '../schema/Route';
import { Repository } from './Repository';

export class RouteRepo extends Repository<typeof Route, RouteDocument> {
  constructor() {
    super(Route);
  }

  public async findByUserId(ownerId: string): Promise<RouteDocument[]> {
    return this.findAll({ ownerId });
  }

  public async findByExperienceId(experienceId: string): Promise<RouteDocument[]> {
    return this.findAll({ experienceId });
  }
}
