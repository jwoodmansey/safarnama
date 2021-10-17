import { Request, Response } from 'express'
import { UserRepo } from '../model/repo/UserRepo'
import { PublicProfile } from '@common/experience'
import { selectUserId } from '../utils/auth'

export async function getMyProfile(request: Request, response: Response) {
  try {
    const profile = await getProfileById(selectUserId(request))
    console.log('getMyProfile', profile)
    return response.json(profile)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

async function getProfileById(id: string): Promise<PublicProfile | undefined> {
  const userRepo = new UserRepo()
  const user = await userRepo.findById(id)
  if (!user) {
    return undefined
  }
  return {
    id,
    displayName: user.displayName,
    photoURL: user.photoURL,
    bio: user.bio,
    roles: user.roles,
  }
}

export async function editProfile(request: Request, response: Response) {
  try {
    const thisUser = selectUserId(request)
    const editingUser = request.params.userId
    if (thisUser !== editingUser) {
      return response.status(401).json(
      { error: 'You do not have permission to edit this Route' })
    }
    const userRepo = new UserRepo()
    await userRepo.edit(editingUser,  { bio: request.body.bio })
    return response.status(200).send()
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}
