import { ExperienceData } from '@common/experience'
import * as mongoose from 'mongoose'

export const Experience = mongoose.model<ExperienceData>('Experience', new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: Date,
  updatedAt: Date,
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}))
