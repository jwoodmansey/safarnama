import { ProjectData } from '@common/project'
import { model, Schema } from 'mongoose'

export const Project = model<ProjectData>('Project', new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  members: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, roles: [{ type: String }] }],
  iOS: {
    appStoreId: { type: String },
    bundleId: { type: String },
  },
  android: {
    package: { type: String }
  },
}))
