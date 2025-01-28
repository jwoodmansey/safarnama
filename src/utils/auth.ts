import { Request } from 'express';
import { UserData } from '@common/user';

interface Entity {
  ownerId?: string
}

interface EntityWithCollaborators {
  collaborators?: string[]
}

export function checkOwner(request: Request, entity: Entity): boolean {
  const thisUser = (request.user as UserData)?._id;
  if (!entity.ownerId) {
    return false;
  }
  const entityOwner = entity.ownerId.toString();
  const valid = thisUser === entityOwner;
  return valid;
}

/**
 * This is a bit of a workaround,
 * we should be able to force these types once it's been through the middleware
 */
export function selectUserId(request: Request): string {
  const user = request.user as UserData;
  if (!user?._id) {
    throw new Error('User not found');
  }
  return user._id!;
}

export function isACollaborator(request: Request, entity: EntityWithCollaborators): boolean {
  if (!entity.collaborators) {
    return false;
  }
  return entity.collaborators.includes(selectUserId(request));
}
