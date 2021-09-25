import * as mongoose from 'mongoose'
import { ProjectData } from '@common/project'

export interface ProjectModel extends ProjectData, mongoose.Document {}