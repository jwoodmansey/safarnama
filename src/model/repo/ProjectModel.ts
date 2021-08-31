import * as mongoose from 'mongoose'
import { Project } from '@common/project'

export interface ProjectModel extends Project, mongoose.Document {}