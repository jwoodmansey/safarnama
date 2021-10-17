import * as mongoose from 'mongoose'
import { PointOfInterestModel } from '../repo/PointOfInterestModel'

export const PointOfInterest = mongoose.model<PointOfInterestModel>('PointOfInterest', new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: Date,
  updatedAt: Date,
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  experienceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Experience' },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  type: {
    name: {
      type: String,
      required: true,
    },
    matIcon: {
      type: String,
      required: false,
    },
    imageIconURL: {
      type: String,
      required: false,
    },
  },
  triggerZone: {
    type: {
      type: String,
      enum: ['circle'],
    },
    colour: String,
    lat: Number,
    lng: Number,
    radius: Number,
  },
}))
