import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { Request, Response } from 'express'
import { checkOwner } from '../utils/auth'
import { MediaDocument } from '@common/media'
import { PointOfInterestDocument } from '@common/point-of-interest'
import { loadRealPaths } from '../controllers/MediaController'
import { MediaRepo } from '../model/repo/MediaRepo'

export async function createPlace(request: Request, response: Response) {
  const repo = new PointOfInterestRepo()
  const poiData: PointOfInterestDocument = {
    ...request.body,
    createdAt: new Date(),
    ownerId: request.user._id,
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
    if (!checkOwner(request, poi)) {
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
      ownerId: request.user._id, // User cannot change this field
    })
    const pop = (await poi.save()).populate('media')
    const resp = await pop.execPopulate()
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
    if (!checkOwner(request, poi)) {
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
