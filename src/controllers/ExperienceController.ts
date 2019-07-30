import { Request, Response } from 'express'
import { ExperienceData, ExperienceSnapshotData } from '@common/experience'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { checkOwner } from '../utils/auth'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { RouteRepo } from '../model/repo/RouteRepo'
import { PointOfInterestDocument } from '@common/point-of-interest'
import { MediaDocument } from '@common/media'
import { loadRealPaths } from './MediaController'

// TODO as with other controllers, probably want to pass the repo as a param, so it's mockable
export async function createExperience(request: Request, response: Response) {
  const repo = new ExperienceRepo()
  const experienceData: ExperienceData = {
    _id: undefined,
    name: request.body.name,
    description: request.body.description,
    createdAt: new Date(),
    ownerId: request.user._id,
  }
  try {
    const res = await repo.addNewExperience(experienceData)
    return response.json(res)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function editExperience(request: Request, response: Response) {
  const repo = new ExperienceRepo()
  try {
    const experience = await repo.getModelById(request.params.experienceId)
    if (experience === null) {
      return response.status(404).json({ error: 'Experience not found' })
    }
    if (!checkOwner(request, experience)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this experience' })
    }
    experience.name = request.body.name
    experience.description = request.body.description
    const dbResp = await experience.save()
    return response.json(dbResp.toJSON())
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function getExperienceSnapshot(request: Request, response: Response) {
  const repo = new ExperienceRepo()
  try {
    const snapshot = await repo.getLatestSnapshotByExperienceId(request.params.experienceId)
    if (snapshot === null) {
      return response.status(404).json({ error: 'Experience snapshot not found' })
    }
    return response.json(snapshot)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function publishExperienceSnapshot(request: Request, response: Response) {
  try {
    const repo = new ExperienceRepo()
    const placeRepo = new PointOfInterestRepo()
    const routeRepo = new RouteRepo()

    const experience = await repo.getModelById(request.params.experienceId)
    if (experience === null) {
      return response.status(404).json({ error: 'Experience not found' })
    }
    // TODO this NEEDS to happen atomically
    const prevSnapshot =
      await repo.getLatestSnapshotByExperienceId(request.params.experienceId)
    let version = 1
    if (prevSnapshot) {
      version = prevSnapshot.metaData.version + 1
    }

    if (!checkOwner(request, experience)) {
      return response.status(401).json(
        { error: 'You do not have permission to publish this experience' })
    }
    const experienceData: ExperienceData = experience.toObject()
    experienceData.pointOfInterests = []
    experienceData.routes = []
    experienceData.pointOfInterests = await placeRepo.getAllByExperience(experience._id)
    experienceData.pointOfInterests.forEach((poi) => {
      if (poi.media) {
        poi.media = loadRealPaths(poi.media)
        poi.media = poi.media.map((media) => {
          return {
            ...media,
            placeId: poi._id,
          }
        })
      }
    })
    experienceData.routes = await routeRepo.getAllByExperience(experience._id)

    // todo work out if we already have a snapshot and get published at date from there?
    // why do we even need to store published at time? can just query for it if ever need
    const snapshot: ExperienceSnapshotData = {
      _id: undefined,
      ownerId: request.user._id,
      data: {
        ...experienceData,
      },
      metaData: {
        version,
        created_at: new Date(),
        size: getTotalSizeForPlaces(experienceData.pointOfInterests),
      },
    }
    const dbResp = await repo.saveSnapshot(snapshot)
    return response.json(dbResp)
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

function getTotalSizeForPlaces(places: PointOfInterestDocument[] | undefined): number {
  if (!places) {
    return 0
  }
  const allMedia: MediaDocument[][] = places.map(place => place.media)
  return getTotalSize(allMedia.reduce((acc, val) => acc.concat(val), []))
}

function getTotalSize(media: MediaDocument[]): number {
  if (!media) {
    return 0
  }
  const done: string[] = []
  return media.reduce(
    (prev, item) => {
      // Only count each media item once even if it appears multiple places
      if (done.includes(item._id)) {
        return prev
      }
      done.push(item._id)
      return prev + item.size
    },
    0)
}