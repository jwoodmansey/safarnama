import { User } from '../schema/User'
import { UserData } from '@common/user'

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

  public async getAll(): Promise<UserData[]> {
    return User.find({}).lean()
  }

  public async edit(
    id: string,
    edit: {
      bio: string,
    }): Promise<UserData> {
    console.log('USER REPO: Edit', id)
    const model = await User.findById(id)
    if (model) {
      console.log('User found, going to edit...', model.toJSON())
      model.set({ ...edit, updatedAt: new Date() })
      const dbResp = await model.save()
      return dbResp.toJSON()
    }
    throw new Error('Could not find user to edit it' + id)
  }
}
