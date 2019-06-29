import * as mongoose from 'mongoose'
import { PointOfInterestDocument } from '@common/point-of-interest'

export interface PointOfInterestModel extends PointOfInterestDocument, mongoose.Document {}
