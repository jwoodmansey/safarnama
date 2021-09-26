import { ExperienceData, ExperienceSnapshotData } from '@common/experience'
import { ObjectID } from 'bson'
import { ExperienceModel, ExperienceSnapshotModel } from './ExperienceModel'
import Experience = require('../schema/Experience')
import ExperienceSnapshot = require('../schema/ExperienceSnapshot')

export class ExperienceRepo {

  public async addNewExperience(experienceData: ExperienceData): Promise<ExperienceData> {
    console.log('EXPERIENCE REPO: Adding new experience', experienceData)
    const e = new Experience(experienceData)
    const dbResp = await e.save()
    return dbResp.toObject()
  }

  public async getAllByUser(userId: string): Promise<ExperienceData[]> {
    console.log('EXPERIENCE REPO: Get all by user', userId)
    const res = await Experience.find({
      $or: [
        { ownerId: userId },
        { collaborators: userId },
      ],
    }).lean()
    return res
  }

  public async getAllSnapshots(featuredOnly = false): Promise<any[]> {
    const query: any = [
      {
        $sort: {
          'metaData.version': -1,
        },
      },
      {
        $group: {
          _id: '$data._id',
          snapshotId: {
            $first: '$_id',
          },
          name: {
            $first: '$data.name',
          },
          description: {
            $first: '$data.description',
          },
          metaData: {
            $first: '$metaData',
          },
          projects: {
            $first: '$data.projects'
          }
        },
      },
    ]
    if (featuredOnly) {
      query.push({
        $match: {
          'metaData.featured': true,
        },
      })
    }

    const res = await ExperienceSnapshot.aggregate(query).exec()
    return res
  }

  public async getModelById(id: string): Promise<ExperienceModel | null> {
    return Experience.findById(id)
  }

  public async getLatestSnapshotByExperienceId(id: string):
    Promise<ExperienceSnapshotData | null> {
    console.log('EXPERIENCE REPO: getLatestSnapshotByExperienceId', id)
    const latest = await this.getLatestSnapshotModelByExperienceId(id)
    return latest ? latest.toObject() : null
  }

  public async getLatestSnapshotModelByExperienceId(id: string):
    Promise<ExperienceSnapshotModel | null> {
    const snapshot = await ExperienceSnapshot.find({
      'data._id': new ObjectID(id),
    }).sort({
      'metaData.version': 'desc',
    }).limit(1)
    if (snapshot !== null && snapshot.length > 0) {
      return snapshot[0]
    }
    return null
  }

  public async deleteAllSanpshotsByExperienceId(id: string): Promise<void> {
    await ExperienceSnapshot.deleteMany({ 'data._id': new ObjectID(id) }).exec()
  }

  public async saveSnapshot(experienceSnapshot: ExperienceSnapshotData):
    Promise<ExperienceSnapshotData> {

    const snapshot = await ExperienceSnapshot.create(experienceSnapshot)
    return snapshot.toObject()
  }
}
