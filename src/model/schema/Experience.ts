import * as mongoose from 'mongoose'
import { ExperienceModel } from '../repo/ExperienceModel'

export const Experience = mongoose.model<ExperienceModel>('Experience', new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: Date,
  updatedAt: Date,
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}))
