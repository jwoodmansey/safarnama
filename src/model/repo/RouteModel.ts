import * as mongoose from 'mongoose'
import { RouteDocument } from '@common/route'

export interface RouteModel extends RouteDocument, mongoose.Document {}
