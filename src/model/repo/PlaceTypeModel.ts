import * as mongoose from 'mongoose'
import { PlaceType } from '@common/point-of-interest'

export interface PlaceTypeModel extends PlaceType, mongoose.Document {}
