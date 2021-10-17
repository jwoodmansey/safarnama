import * as mongoose from 'mongoose'
import { PlaceTypeModel } from '../repo/PlaceTypeModel'

export const PlaceType = mongoose.model<PlaceTypeModel>('PlaceType', new mongoose.Schema({
  name: { type: String, required: true },
  matIcon: { type: String, required: false },
  imageIconURL: {type: Boolean, required: false },
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}))
