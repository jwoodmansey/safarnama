import { RouteDocument } from '@common/route';
import { model, Schema } from 'mongoose';

export const Route = model<RouteDocument>('Route', new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  experienceId: { type: Schema.Types.ObjectId, required: true, ref: 'Experience' },
  geo: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true,
    },
    coordinates: {
      type: [Array],
      required: true,
    },
  },
  colour: { type: String, required: true },
  direction: {
    type: String,
    enum: ['None', 'Ascending', 'Descending'],
  },
}));
