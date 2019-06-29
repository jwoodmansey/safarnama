import { PlaceType as PlaceTypeDocument } from '@common/point-of-interest'
import PlaceType = require('../schema/PlaceType')

export class PlaceTypeRepo {

  public async add(type: PlaceTypeDocument): Promise<string> {
    console.log('PLACE TYPE REPO: Adding new type', type)
    const e = new PlaceType({ ...type })
    const dbResp = await e.save()
    return dbResp.toJSON()
  }

  public async getAllByUser(userId: string): Promise<PlaceTypeDocument[]> {
    console.log('PLACE TYPE REPO: Getting all types', userId)
    const res = await PlaceType.find({ ownerId: userId }).lean()
    console.log('res', res)
    return res
  }
}
