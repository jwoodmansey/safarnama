import * as mongoose from 'mongoose'
import { UserData } from '@common/user'

export interface UserModel extends UserData, mongoose.Document {}
