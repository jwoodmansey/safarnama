import { RouteDocument } from '@common/route'
import { RouteModel } from './RouteModel'
import { Repository } from './Repository'
import Route = require('../schema/Route')

export class RouteRepo extends Repository<RouteModel, RouteDocument> {

  constructor() {
    super(Route)
  }

  public async getAllByUser(ownerId: string): Promise<RouteDocument[]> {
    return this.findAll({ ownerId })
  }

  public async getAllByExperience(experienceId: string): Promise<RouteDocument[]> {
    return this.findAll({experienceId})
  }
}
