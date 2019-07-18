import { MediaDocument } from '@common/media'

export type MediaType = 'Text' | 'Image' | 'Audio' | 'Video' | 'PDF' | 'Unsupported'

export class Media {

  private doc: MediaDocument

  constructor(media: MediaDocument) {
    this.doc = media
  }

  get url(): string {
    return this.doc.path
  }

  get thumbUrl(): string {
    return this.doc.thumbPath
  }

  get type(): MediaType {
    switch (this.doc.mimetype) {
      case 'image/jpeg':
      case 'image/png':
        return 'Image'
      case 'video/mp4':
        return 'Video'
      case 'application/pdf':
        return 'PDF'
      case 'audio/mpeg':
      case 'audio/mp4':
        return 'Audio'
      case 'text/plain':
      case 'text/html':
        return 'Text'
      default:
        return 'Unsupported'
    }
  }

  get id(): string {
    return this.doc._id
  }

  get description(): string | undefined {
    return this.doc.description
  }

  get name(): string {
    return this.doc.name || ''
  }

  get acknowledgements(): string | undefined {
    return this.doc.acknowledgements
  }

  set description(val: string | undefined) {
    this.doc.description = val
  }

  set name(val: string | undefined) {
    this.doc.name = val
  }

  set acknowledgements(val: string | undefined) {
    this.doc.acknowledgements = val
  }

  get createdAt(): Date | undefined {
    return new Date(this.doc.created_at)
  }

  get updatedAt(): Date | undefined {
    return new Date(this.doc.updated_at)
  }

  getDocument(): MediaDocument {
    return { ...this.doc }
  }
}
