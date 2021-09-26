import { RouteDocument } from '@common/route'
import { RouteModel } from './RouteModel'
import Route = require('../schema/Route')
export class RouteRepo {

  public async add(routeData: RouteDocument): Promise<string> {
    console.log('ROUTE REPO: Adding new Route', routeData)
    const e = new Route({ ...routeData })
    const dbResp = await e.save()
    return JSON.stringify(dbResp.toJSON())
  }

  public async getAllByUser(userId: string): Promise<RouteDocument[]> {
    console.log('ROUTE REPO: Get all by user', userId)
    const res = await Route.find({ ownerId: userId }).lean()
    console.log('res', res)
    return res
  }

  public async getAllByExperience(experienceId: string): Promise<RouteDocument[]> {
    console.log('ROUTE REPO: Get all by experience', experienceId)
    const res = await Route.find({ experienceId }).lean()
    console.log('res', res)
    return res
  }

  public async getModel(poiId: string): Promise<RouteModel | null> {
    console.log('ROUTE REPO: Get by id', poiId)
    const res = await Route.findById(poiId)
    console.log('res', res)
    return res
  }
}
