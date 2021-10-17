import { PointOfInterestDocument } from '@common/point-of-interest'
import { PointOfInterest } from '../schema/PointOfInterest'
import { PointOfInterestModel } from './PointOfInterestModel'
import { EntityNotFoundError, Repository } from './Repository'

export class PointOfInterestRepo extends Repository<PointOfInterestModel, PointOfInterestDocument> {

  constructor() {
    super(PointOfInterest)
  }

  public async add(poiData: PointOfInterestDocument): Promise<PointOfInterestDocument> {
    const entity = new this.model(poiData)
    const dbResp = await entity.save()
    const withMedia = await dbResp.populate('media')
    return withMedia.toObject()
  }

  public async findAllByUser(userId: string): Promise<PointOfInterestDocument[]> {
    const res = await this.model.find({ ownerId: userId }).populate('media').lean()
    return res
  }

  public async findByExperienceId(experienceId: string): Promise<PointOfInterestDocument[]> {
    const res = await this.model.find({ experienceId }).populate('media').lean()
    return res
  }

  public async findById(poiId: string): Promise<PointOfInterestDocument | undefined> {
    const res = await this.model.findById(poiId).populate('media').lean()
    return res || undefined
  }

  async edit(id: string, data: Partial<PointOfInterestDocument>): Promise<PointOfInterestDocument> {
    const entity = await this.model.findById(id)
    if (!entity) {
      throw new EntityNotFoundError(`Entity was not found ${id}`)
    }
    entity.set({ ...data, updatedAt: new Date() })
    const dbResp = await (await entity.save()).populate('media')
    return dbResp.toObject()
  }


  // public async delete(poiId: string): Promise<void> {
  //   const res = await PointOfInterest.findById(poiId)
  //   if (res !== null) {
  //     await res.remove()
  //   }
  // }
}
