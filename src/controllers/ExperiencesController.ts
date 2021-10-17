import { ExperienceData, ExperienceResponseData } from '@common/experience'
import { ExperienceRepo } from '../model/repo/ExperienceRepo'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { loadRealPaths } from './MediaController'
import { Request, Response } from 'express'
import { RouteRepo } from '../model/repo/RouteRepo'
import { selectUserId } from '../utils/auth'

const repo = new ExperienceRepo()

export async function getAllMyExperienceData(request: Request, response: Response) {
  const data: ExperienceData[] = await repo.getAllByUser(selectUserId(request))
  const promises = data.map(data => populateExperienceData(data))
  const populated = await Promise.all(promises)
  const responseJson: ExperienceResponseData = {
    forUserId: selectUserId(request),
    data: populated,
  }
  return response.json(responseJson)
}

export async function getAllFeaturedExperiences(_request: Request, response: Response) {
  const exps = await repo.getAllSnapshots(true)
  return response.json(exps)
}

export async function populateExperienceData(experience: ExperienceData): Promise<ExperienceData> {
  const placeRepo = new PointOfInterestRepo()
  const routeRepo = new RouteRepo()
  experience.routes = [] = await routeRepo.findByExperienceId(experience._id)
  experience.pointOfInterests = await placeRepo.findByExperienceId(experience._id)
  experience.pointOfInterests.forEach((poi) => {
    if (poi.media) {
      poi.media = loadRealPaths(poi.media)
    }
  })
  return experience
}
