import { UserData, User } from '../schema/User'

export class UserRepo {

  public createUserFromProfile(profile: any, accessToken: string, refreshToken: string): UserData {
    return {
      displayName: profile.displayName,
      photoURL: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
      createdAt: new Date(),
      googleId: profile.provider === 'google' ? profile.id : undefined,
      facebookId: profile.provider === 'facebook' ? profile.id : undefined,
      token: {
        accessToken,
        refreshToken,
      },
    }
  }

  public async get(id: string): Promise<UserData | null> {
    const model = await User.findById(id).lean()
    return model !== null ? model : null
  }
}
