
import { Request } from 'express'

interface Entity {
  ownerId?: string
}

export function checkOwner(request: Request, entity: Entity): boolean {
  const thisUser = request.user._id
  if (!entity.ownerId) {
    return false
  }
  const entityOwner = entity.ownerId.toString()
  const valid = thisUser === entityOwner
  return valid
}
