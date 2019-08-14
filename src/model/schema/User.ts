import * as mongoose from 'mongoose'

export type UserData = {
  displayName: string,
  photoURL?: string,
  createdAt: Date,
  updatedAt?: Date,
  googleId?: string,
  facebookId?: string,
  token: Token,
  bio?: string,
}

export type Token = {
  accessToken: string,
  refreshToken: string,
}

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
  token: {
    accessToken: { type: String },
    refreshToken: { type: String },
  },
}))
