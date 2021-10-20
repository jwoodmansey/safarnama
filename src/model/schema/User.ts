import { Schema, model } from 'mongoose'
import { UserData } from '@common/user'

export const User = model<UserData>('User', new Schema({
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
