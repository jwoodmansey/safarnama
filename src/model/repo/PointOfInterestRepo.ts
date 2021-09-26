import { PointOfInterestDocument } from '@common/point-of-interest'
import PointOfInterest = require('../schema/PointOfInterest')
import { PointOfInterestModel } from './PointOfInterestModel'
export class PointOfInterestRepo {

  public async addNewPointOfInterest(poiData: PointOfInterestDocument):
    Promise<PointOfInterestDocument> {

    console.log('POI REPO: Adding new POI', poiData)
    const e = new PointOfInterest({ ...poiData })
    const dbResp = await e.save()
    const withMedia = await dbResp.populate('media')
    return withMedia.toObject()
  }

  public async getAllByUser(userId: string): Promise<PointOfInterestDocument[]> {
    console.log('POI REPO: Get all by user', userId)
    const res = await PointOfInterest.find({ ownerId: userId }).populate('media').lean()
    console.log('res', res)
    return res
  }

  public async getAllByExperience(experienceId: string): Promise<PointOfInterestDocument[]> {
    console.log('POI REPO: Get all by experience', experienceId)
    const res = await PointOfInterest.find({ experienceId }).populate('media').lean()
    console.log('res', res)
    return res
  }

  public async getModel(poiId: string): Promise<PointOfInterestModel | null> {
    console.log('POI REPO: Get by id', poiId)
    const res = await PointOfInterest.findById(poiId).populate('media')

    console.log('res', res)
    return res
  }

  // public async delete(poiId: string): Promise<void> {
  //   const res = await PointOfInterest.findById(poiId)
  //   if (res !== null) {
  //     await res.remove()
  //   }
  // }
}
