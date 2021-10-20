import { PlaceType as PlaceTypeDoc } from '@common/point-of-interest'
import { PlaceType } from '../schema/PlaceType'
import { Repository } from './Repository'

export class PlaceTypeRepo extends Repository<typeof PlaceType, PlaceTypeDoc> {

  constructor() {
    super(PlaceType)
  }

  public async getAllByUser(ownerId: string): Promise<PlaceTypeDoc[]> {
    return this.findAll({ ownerId })
  }
}
