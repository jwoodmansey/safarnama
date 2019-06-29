import { ExperienceData, ExperienceSnapshotData } from '@common/experience'
import * as mongoose from 'mongoose'

export interface ExperienceModel extends ExperienceData, mongoose.Document {}

export interface ExperienceSnapshotModel extends ExperienceSnapshotData, mongoose.Document {}
