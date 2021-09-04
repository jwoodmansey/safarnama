import * as mongoose from 'mongoose'
import { ProjectModel } from '../repo/ProjectModel'

export = mongoose.model<ProjectModel>('Project', new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  members: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: { type: String } }],
  iOS: {
    appStoreId: { type: String },
    bundleId: { type: String },
  },
  android: {
    package: { type: String }
  },
}))
