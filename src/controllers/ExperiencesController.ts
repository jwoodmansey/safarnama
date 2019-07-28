import { ExperienceData } from '@common/experience'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { loadRealPaths } from './MediaController'
import { RouteRepo } from '../model/repo/RouteRepo'
import { Request, Response } from 'express'

export async function getAllMyExperienceData(request: Request, response: Response) {
  const repo = new ExperienceRepo()
  const placeRepo = new PointOfInterestRepo()
  const routeRepo = new RouteRepo()

  const data: ExperienceData[] = await repo.getAllByUser(request.user._id)
  // TODO can run this in a Promise.all for async
  for (const experience of data) {
    experience.pointOfInterests = []
    experience.routes = []
    experience.pointOfInterests = await placeRepo.getAllByExperience(
          experience._id)
    experience.pointOfInterests.forEach((poi) => {
      if (poi.media) {
        poi.media = loadRealPaths(poi.media)
      }
    })
    experience.routes = await routeRepo.getAllByExperience(experience._id)
  }
  return response.json(data)
}
