import { MediaDocument } from '@common/media'
import { MediaModel } from '../repo/MediaModel'
import { Media } from '../schema/Media'
import { EntityNotFoundError, Repository } from './Repository'

export class MediaRepo extends Repository<MediaModel, MediaDocument> {

  constructor() {
    super(Media)
  }

  public async findWithExperiences(mediaId: string): Promise<MediaDocument | null> {
    const res = await this.model.findById(mediaId).populate('associatedExperiences')
    if (!res) {
      throw new EntityNotFoundError(`Media not found ${mediaId}`)
    }
    return res.toObject()
  }

  public async getAllByUser(ownerId: string): Promise<MediaDocument[]> {
    return this.findAll({ ownerId })
  }

  // name?: string,
  // acknowledgements?: string,
  // description?: string,
  // associatedExperiences?: string[],
  // externalLinks?: string[]
}
