import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { Request, Response } from 'express'
import { checkOwner, selectUserId } from '../utils/auth'
import { MediaDocument } from '@common/media'
import { PointOfInterestDocument } from '@common/point-of-interest'
import { loadRealPaths } from '../controllers/MediaController'
import { MediaRepo } from '../model/repo/MediaRepo'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { PointOfInterestModel } from '../model/repo/PointOfInterestModel'

const repo = new PointOfInterestRepo()
const expRepo = new ExperienceRepo()

export async function createPlace(request: Request, response: Response) {
  const exp = await expRepo.getModelById(request.body.experienceId)
  if (exp === null) {
    return response.status(404).json({ error: 'Place not found' })
  }
  if (!checkOwner(request, exp) &&
    !(exp.collaborators && exp.collaborators.includes(selectUserId(request)))
  ) {
    return response.status(401).json(
      { error: 'You do not have permission to add a place to this experience' })
  }

  const poiData: PointOfInterestDocument = {
    ...request.body,
    createdAt: new Date(),
    ownerId: exp.ownerId, // The owner is always the experience creator
  }
  try {
    const res = await repo.addNewPointOfInterest(poiData)
    loadRealMediaPaths(res)
    return response.json(res)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function editPlace(request: Request, response: Response) {
  const repo = new PointOfInterestRepo()
  const mediaRepo = new MediaRepo()
  try {
    const poi = await repo.getModel(request.params.poiId)

    if (poi === null) {
      return response.status(404).json({ error: 'Place not found' })
    }
    if (!checkOwner(request, poi) && !(await isAnExperienceCollaborator(request, poi))) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Place' })
    }
    let mediaIds: string[] = []
    if (request.body.media) {
      mediaIds = request.body.media.map((media: MediaDocument) => media._id)
      delete request.body.media
    }

    // Mark each media as now associated with this experience
    mediaIds.forEach(async (id) => {
      const media = await mediaRepo.get(id)
      if (media) {
        if (!media.associatedExperiences) {
          media.associatedExperiences = []
        }
        if (!media.associatedExperiences.find(thisId => thisId === id)) {
          media.associatedExperiences.push(poi.experienceId)
          console.log('Associating experiences with media', media.associatedExperiences)
          await mediaRepo.edit(id, { associatedExperiences: media.associatedExperiences })
        }
      }
    })

    poi.set({
      ...request.body,
      media: mediaIds,
      updatedAt: new Date(),
      ownerId: poi.ownerId, // User cannot change this field!!!
      createdAt: poi.createdAt,
    })
    const pop = (await poi.save()).populate('media')
    const resp = await pop
    const obj = resp.toObject()
    loadRealMediaPaths(obj)
    return response.json(obj)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function deletePlace(request: Request, response: Response) {
  const repo = new PointOfInterestRepo()
  try {
    const poi = await repo.getModel(request.params.poiId)
    if (poi === null) {
      return response.status(404).json({ error: 'Place not found' })
    }
    if (!checkOwner(request, poi) && !(await isAnExperienceCollaborator(request, poi))) {
      return response.status(401).json(
        { error: 'You do not have permission to delete this place' })
    }
    await poi.remove()
    return response.json({ success: true })
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

function loadRealMediaPaths(poi: PointOfInterestDocument): void {
  if (poi.media) {
    poi.media = loadRealPaths(poi.media)
  }
}

export async function isAnExperienceCollaborator(
  request: Request,
  poi: PointOfInterestModel,
): Promise<boolean> {
  console.log('Checking collaborator')
  const experienceRepo = new ExperienceRepo()
  const exp = await experienceRepo.getModelById(poi.experienceId)
  if (!exp) {
    throw new Error('Experience not found')
  }
  if (!exp.collaborators) {
    return false
  }
  return exp.collaborators.includes(selectUserId(request))
}
