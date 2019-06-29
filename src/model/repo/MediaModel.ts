import * as mongoose from 'mongoose'
import { MediaDocument } from '@common/media'

export interface MediaModel extends MediaDocument, mongoose.Document {}
