import { PlaceType as PlaceTypeDoc } from '@common/point-of-interest';
import { model, Schema } from 'mongoose';

export const PlaceType = model<PlaceTypeDoc>('PlaceType', new Schema({
  name: { type: String, required: true },
  matIcon: { type: String, required: false },
  imageIconURL: { type: Boolean, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}));
