import * as mongoose from 'mongoose'
import { ProjectModel } from '../repo/ProjectModel'

export = mongoose.model<ProjectModel>('PlaceType', new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  members: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: { type: String } }]
}))
