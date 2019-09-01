import { ExperienceData, ExperienceResponseData } from '@common/experience'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { loadRealPaths } from './MediaController'
// import { RouteRepo } from '../model/repo/RouteRepo'
import { Request, Response } from 'express'

export async function getAllMyExperienceData(request: Request, response: Response) {
  const repo = new ExperienceRepo()

  const data: ExperienceData[] = await repo.getAllByUser(request.user._id)
  const promises = data.map(data => populateExperienceData(data))
  const populated = await Promise.all(promises)
  const responseJson: ExperienceResponseData = {
    forUserId: request.user._id,
    data: populated,
  }
  return response.json(responseJson)
}

async function populateExperienceData(experience: ExperienceData): Promise<ExperienceData> {
  // can we use a populate on the get?
  const placeRepo = new PointOfInterestRepo()
  // const routeRepo = new RouteRepo()

  experience.pointOfInterests = []
  experience.routes = []
  experience.pointOfInterests = await placeRepo.getAllByExperience(
        experience._id)
  experience.pointOfInterests.forEach((poi) => {
    if (poi.media) {
      poi.media = loadRealPaths(poi.media)
    }
  })
  // experience.routes = await routeRepo.getAllByExperience(experience._id)
  return experience
}
