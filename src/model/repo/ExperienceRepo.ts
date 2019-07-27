import { ExperienceData, ExperienceSnapshotData } from '@common/experience'
import Experience = require('../schema/Experience')
import { ExperienceModel } from './ExperienceModel'
import ExperienceSnapshot = require('../schema/ExperienceSnapshot')
import { ObjectID } from 'bson'

export class ExperienceRepo {

  public async addNewExperience(experienceData: ExperienceData): Promise<string> {
    console.log('EXPERIENCE REPO: Adding new experience', experienceData)
    const e = new Experience(experienceData)
    const dbResp = await e.save()
    return dbResp.toJSON()
  }

  public async getAllByUser(userId: string): Promise<ExperienceData[]> {
    console.log('EXPERIENCE REPO: Get all by user', userId)
    const res = await Experience.find({ ownerId: userId }).lean()

    // TODO I think we might want to decouple POIs and routes from experiences,
    // and instead have experiences include the place/route ID
    // .populate([
    //   {
    //     path: 'pointOfInterests',
    //     populate: {
    //       path: 'media',
    //       model: 'Media',
    //     },
    //   },
    //   {
    //     path: 'routes',
    //   },
    // ])
    console.log('res', res)
    return res
  }

  // todo, dont expose the models to the controllers
  public async getModelById(id: string): Promise<ExperienceModel | null> {
    return Experience.findById(id)
  }

  public async getLatestSnapshotByExperienceId(id: string): Promise<ExperienceSnapshotData | null> {
    console.log('EXPERIENCE REPO: getLatestSnapshotByExperienceId', id)
    const snapshot = await ExperienceSnapshot.find({
      'data._id': new ObjectID(id),
    }).sort({
      'metaData.version': 'desc',
    }).limit(1)
    if (snapshot !== null && snapshot.length > 0) {
      return snapshot[0].toObject()
    }
    return null
  }

  public async saveSnapshot(experienceSnapshot: ExperienceSnapshotData):
    Promise<ExperienceSnapshotData> {

    const snapshot = await ExperienceSnapshot.create(experienceSnapshot)
    return snapshot.toObject()
  }
}
