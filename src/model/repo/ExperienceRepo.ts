import { ExperienceData, ExperienceSnapshotData } from '@common/experience';
import { ObjectID } from 'bson';
import { Experience } from '../schema/Experience';
import { ExperienceSnapshot } from '../schema/ExperienceSnapshot';
import { Repository } from './Repository';

export class ExperienceRepo extends Repository<typeof Experience, ExperienceData> {
  constructor() {
    super(Experience);
  }

  public async getAllByUser(userId: string): Promise<ExperienceData[]> {
    return this.findAll({
      $or: [
        { ownerId: userId },
        { collaborators: userId },
      ],
    });
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
            $first: '$data.projects',
          },
        },
      },
    ];
    if (featuredOnly) {
      query.push({
        $match: {
          'metaData.featured': true,
        },
      });
    }

    const res = await ExperienceSnapshot.aggregate(query).exec();
    return res;
  }

  public async getModelById(id: string) {
    return Experience.findById(id);
  }

  public async getLatestSnapshotByExperienceId(id: string):
  Promise<ExperienceSnapshotData | null> {
    console.log('EXPERIENCE REPO: getLatestSnapshotByExperienceId', id);
    const latest = await this.getLatestSnapshotModelByExperienceId(id);
    return latest ? latest.toObject() : null;
  }

  public async getLatestSnapshotModelByExperienceId(id: string) {
    const snapshot = await ExperienceSnapshot.find({
      'data._id': new ObjectID(id),
    }).sort({
      'metaData.version': 'desc',
    }).limit(1);
    if (snapshot !== null && snapshot.length > 0) {
      return snapshot[0];
    }
    return null;
  }

  public async deleteAllSanpshotsByExperienceId(id: string): Promise<void> {
    await ExperienceSnapshot.deleteMany({ 'data._id': new ObjectID(id) }).exec();
  }

  public async saveSnapshot(experienceSnapshot: ExperienceSnapshotData):
  Promise<ExperienceSnapshotData> {
    const snapshot = await ExperienceSnapshot.create(experienceSnapshot);
    return snapshot.toObject();
  }
}
