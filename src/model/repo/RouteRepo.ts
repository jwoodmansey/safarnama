import { RouteDocument } from '@common/route'
import { RouteModel } from './RouteModel'
import { Repository } from './Repository'
import { Route } from '../schema/Route'

export class RouteRepo extends Repository<RouteModel, RouteDocument> {

  constructor() {
    super(Route)
  }

  public async findByUserId(ownerId: string): Promise<RouteDocument[]> {
    return this.findAll({ ownerId })
  }

  public async findByExperienceId(experienceId: string): Promise<RouteDocument[]> {
    return this.findAll({ experienceId })
  }
}
