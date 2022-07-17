import { MediaDocument } from '@common/media';
import { model, Schema } from 'mongoose';

export const Media = model<MediaDocument>('Media', new Schema({
  path: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  size: { type: Number, required: true },
  md5: { type: String, required: true },
  mimetype: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  acknowledgements: { type: String },
  associatedExperiences: [{
    type: Schema.Types.ObjectId, ref: 'Experience', required: false,
  }],
  externalLinks: [{
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
  // geo: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [Array],
  //     required: true,
  //   },
  // },
}));
