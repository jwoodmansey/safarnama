import { MediaDocument } from '@common/media'
import Media = require('../schema/Media')

export class MediaRepo {

  public async add(mediaData: MediaDocument): Promise<string> {
    console.log('MEDIA REPO: Adding new media', mediaData)
    const e = new Media({ ...mediaData })
    const dbResp = await e.save()
    return dbResp._id
  }

  public async get(mediaId: string): Promise<MediaDocument | null> {
    console.log('Media REPO: Get by id', mediaId)
    const res = await Media.findById(mediaId)
    if (res) {
      return res.toJSON()
    }
    return null
  }

  public async getAllByUser(userId: string): Promise<MediaDocument[]> {
    console.log('MEDIA REPO: Get all by user', userId)
    const res = await Media.find({ ownerId: userId }).lean()
    console.log('res', res)
    return res
  }

  public async edit(
    id:string,
    edit: {
      name?: string,
      acknowledgements?: string,
      description?: string,
      associatedExperiences?: string[],
    }): Promise<MediaDocument> {
    console.log('MEDIA REPO: Delete', id)
    const model = await Media.findById(id)
    if (model) {
      console.log('Media found, going to edit...', model.toJSON())
      model.set({ ...edit, updatedAt: new Date() })
      const dbResp = await model.save()
      return dbResp.toJSON()
    }
    throw new Error('Could not find media to edit it' + id)
  }

  public async delete(id: string): Promise<void> {
    console.log('MEDIA REPO: Delete', id)
    const model = await Media.findById(id)
    if (model) {
      console.log('Media found, going to delete...', model.toJSON())
      await model.remove()
      return
    }
    throw new Error('Could not find media to delete it' + id)
  }
}
