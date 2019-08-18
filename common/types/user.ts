export type UserData = {
  displayName: string,
  photoURL?: string,
  createdAt: Date,
  updatedAt?: Date,
  googleId?: string,
  facebookId?: string,
  token: Token,
  roles?: string[],
  bio?: string,
}

export type Token = {
  accessToken: string,
  refreshToken: string,
}
