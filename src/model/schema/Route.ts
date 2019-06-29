import * as mongoose from 'mongoose'
import { RouteModel } from '../repo/RouteModel'

export = mongoose.model<RouteModel>('Route', new mongoose.Schema({
  name: { type: String, required: true },
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  experienceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Experience' },
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
}))
