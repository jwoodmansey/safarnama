import { ExperienceData } from '@common/experience'
import { Response, Router } from 'express'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { RouteRepo } from '../model/repo/RouteRepo'
import { loadRealPaths } from './MediaRouter'
export class ExperiencesRouter {

  private router: Router = Router()
  // private mediaRepo = new MediaRepo()
  private pointOfInterestRepo = new PointOfInterestRepo()

  getRouter(): Router {
    const repo = new ExperienceRepo()
    const routeRepo = new RouteRepo()

    this.router.get('/mine', async (request: any, response: Response) => {
      const data: ExperienceData[] = await repo.getAllByUser(request.user._id)
      for (const experience of data) {
        experience.pointOfInterests = []
        experience.routes = []
        experience.pointOfInterests = await this.pointOfInterestRepo.getAllByExperience(
          experience._id)
        experience.pointOfInterests.forEach((poi) => {
          if (poi.media) {
            poi.media = loadRealPaths(poi.media)
          }
        })
        experience.routes = await routeRepo.getAllByExperience(experience._id)
      }
      return response.json(data)
    })

    return this.router
  }

  // async getPoiWithMedia(poi: PointOfInterestDocument):
  //   Promise<PointOfInterestDocumentExtended> {
  //   this.pointOfInterestRepo.getAllByUser('')
  //   const mediaPromises = poi.mediaIds.map(media => this.mediaRepo.get(media))
  //   Promise.all(poi.)
  // }
}
