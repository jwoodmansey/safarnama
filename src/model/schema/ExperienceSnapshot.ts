import * as mongoose from 'mongoose'
import { ExperienceSnapshotModel } from '../repo/ExperienceModel'
const AUTO_INCREMENT = require('mongoose-sequence')(mongoose)

// tslint:disable-next-line:variable-name
const ExperienceSnapshotSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  metaData: {
    created_at: { type: Date, default: Date.now },
    version: { type: Number },
    size: { type: Number, default: 0 },
    shortLink: { type: String, required: false },
    featured: {  type: Boolean, required: false, default: false },
    tags: [{type: String}],
    ownerPublicProfile: {
      required: false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      photoURL: {
        type: String,
        required: false,
      },
      displayName: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        required: false,
      },
    },
  },
  data: {}, // This should probably use the experience schema for querying
})

ExperienceSnapshotSchema.plugin(AUTO_INCREMENT, {
  id: 'snapshot_version',
  inc_field: 'metaData.version',
  reference_fields: ['data._id'],
})
export = mongoose.model<ExperienceSnapshotModel>('ExperienceSnapshot', ExperienceSnapshotSchema)
