import { ExperienceData, ExperienceResponseData } from '@common/experience';
import { Request, Response } from 'express';
import { ExperienceRepo } from '../model/repo/ExperienceRepo';
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo';
import { loadRealPaths } from './MediaController';
import { RouteRepo } from '../model/repo/RouteRepo';
import { selectUserId } from '../utils/auth';

const repo = new ExperienceRepo();

export async function populateExperienceData(experience: ExperienceData): Promise<ExperienceData> {
  const placeRepo = new PointOfInterestRepo();
  const routeRepo = new RouteRepo();
  const routes = await routeRepo.findByExperienceId(experience._id);
  experience.routes = routes || [];
  experience.pointOfInterests = await placeRepo.findByExperienceId(experience._id);
  experience.pointOfInterests.forEach((poi) => {
    if (poi.media) {
      poi.media = loadRealPaths(poi.media);
    }
  });
  return experience;
}

export async function getAllMyExperienceData(request: Request, response: Response) {
  const data: ExperienceData[] = await repo.getAllByUser(selectUserId(request));
  const promises = data.map((expDataItem) => populateExperienceData(expDataItem));
  const populated = await Promise.all(promises);
  const responseJson: ExperienceResponseData = {
    forUserId: selectUserId(request),
    data: populated,
  };
  return response.json(responseJson);
}

export async function getAllFeaturedExperiences(_request: Request, response: Response) {
  const exps = await repo.getAllSnapshots(true);
  return response.json(exps);
}
