import { User } from '../schema/User'
import { UserData } from '@common/user'
import { UserModel } from './UserModel'
import { Repository } from './Repository'

export class UserRepo extends Repository<UserModel, UserData> {

  constructor() {
    super(User)
  }

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
      _id: profile._id,
    }
  }
  
  public async findByEmail(email: string): Promise<UserData | null> {
    const user = await this.findAll({ email })
    return user[0] || null
  }

  public async edit(
    id: string,
    edit: {
      bio: string,
    }): Promise<UserData> {
    return super.edit(id, edit)
  }
}
