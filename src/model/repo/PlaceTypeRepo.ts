import { PlaceType as PlaceTypeDocument } from '@common/point-of-interest'
import PlaceType = require('../schema/PlaceType')

export class PlaceTypeRepo {

  public async add(type: PlaceTypeDocument): Promise<string> {
    console.log('PLACE TYPE REPO: Adding new type', type)
    const data = new PlaceType({ ...type })
    const dbResp = await data.save()
    return dbResp.toJSON()
  }

  public async getById(id: string): Promise<PlaceTypeDocument | null> {
    const model = await PlaceType.findById(id).exec()
    if (model) {
      return model.toJSON()
    }
    return null
  }

  public async delete(id: string): Promise<void> {
    await PlaceType.deleteOne({ _id: id }).exec()
  }

  public async getAllByUser(userId: string): Promise<PlaceTypeDocument[]> {
    console.log('PLACE TYPE REPO: Getting all types', userId)
    const res = await PlaceType.find({ ownerId: userId }).lean()
    console.log('res', res)
    return res
  }
}
