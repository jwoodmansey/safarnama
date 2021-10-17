import { PlaceType as PlaceTypeDocument } from '@common/point-of-interest'
import { PlaceType } from '../schema/PlaceType'
import { PlaceTypeModel } from './PlaceTypeModel'
import { Repository } from './Repository'

export class PlaceTypeRepo extends Repository<PlaceTypeModel, PlaceTypeDocument> {

  constructor() {
    super(PlaceType)
  }

  public async getAllByUser(ownerId: string): Promise<PlaceTypeDocument[]> {
    return this.findAll({ ownerId })
  }
}
