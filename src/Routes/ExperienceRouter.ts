import { ExperienceData, ExperienceSnapshotData } from '@common/experience'
import { Response, Router, Request } from 'express'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { checkOwner } from '../utils/auth'
import { RouteRepo } from '../model/repo/RouteRepo'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { loadRealPaths } from '../controllers/MediaController'
import { MediaDocument } from '@common/media'
import { PointOfInterestDocument } from '@common/point-of-interest'
const { ensureAuthenticated } = require('connect-ensure-authenticated')

export class ExperienceRouter {

  private router: Router = Router()

  getRouter(): Router {

    const repo = new ExperienceRepo()
    const pointOfInterestRepo = new PointOfInterestRepo()
    const routeRepo = new RouteRepo()

    /**
     * Create a new experience
     */
    this.router.post(
      '',
      ensureAuthenticated(),
      async (request: Request, response: Response) => {
        const experienceData: ExperienceData = {
          _id: undefined,
          name: request.body.name,
          createdAt: new Date(),
          ownerId: request.user._id,
        }
        try {
          const res = await repo.addNewExperience(experienceData)
          return response.json(res)
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    /**
     * Edit an existing experience
     */
    this.router.put(
      '/:experienceId',
      ensureAuthenticated(),
      async (request: Request, response: Response) => {
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
          const dbResp = await experience.save()
          return response.json(dbResp.toJSON())
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    /**
     * Gets the last published experience snapshot
     */
    this.router.get(
      '/:experienceId/snapshot',
      async (request: Request, response: Response) => {
        try {
          const snapshot = await repo.getLatestSnapshotByExperienceId(request.params.experienceId)
          if (snapshot === null) {
            return response.status(404).json({ error: 'Experience snapshot not found' })
          }
          return response.json(snapshot)
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.post(
      '/:experienceId/publish',
      ensureAuthenticated(),
      async (request: Request, response: Response) => {
        try {

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
          experienceData.pointOfInterests = await pointOfInterestRepo.getAllByExperience(
            experience._id)
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
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    return this.router
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
