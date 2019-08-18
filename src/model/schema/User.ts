import * as mongoose from 'mongoose'
import { UserData } from '@common/user'

type UserModel = UserData & mongoose.Document

// tslint:disable-next-line:variable-name
export const User = mongoose.model<UserModel>('User', new mongoose.Schema({
  displayName: { type: String, required: true },
  photoURL: String,
  createdAt: Date,
  updatedAt: Date,
  bio: String,
  googleId: String,
  facebookId: String,
  roles: {
    type: [{ type: String }],
    required: false,
  },
  token: {
    accessToken: { type: String },
    refreshToken: { type: String },
  },
}))
