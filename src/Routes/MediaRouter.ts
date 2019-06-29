import { Request, Response, Router } from 'express'
import { UploadedFile } from 'express-fileupload'
import { MediaRepo } from '../model/repo/MediaRepo'
import { checkOwner } from '../utils/auth'
import { MediaDocument } from '@common/media'
import { environment } from '../config/env'

const fs = require('fs')
const filepreview = require('filepreview')

interface UploadedFileExtended extends UploadedFile {
  md5: string,
  size: number,
}

export class MediaRouter {

  private router: Router = Router()
  private repo: MediaRepo = new MediaRepo()

  getRouter(): Router {

    /**
     * Upload new Media
     */
    this.router.post(
      '/process',
      async (request: Request, response: Response) => {
        if (!request.files || Object.keys(request.files).length === 0 ||
          !request.files.filepond || Object.keys(request.files.filepond).length === 0) {
          return response.status(400).send({ code: 400, error: 'No files were uploaded.' })
        }

        try {

          const filesOrFile = request.files.filepond
          if (Array.isArray(filesOrFile)) {
            // const arr = filesOrFile
            // todo multi upload support
          } else {
            const file: UploadedFileExtended = filesOrFile as UploadedFileExtended
            console.log('FILE', file)

            // There seems to be a bug with filepond which is making .html/jpeg
            // files come out as .tml/.peg, 4 letter extensions arent parsed right?
            let ext = file.name.split('.').pop()
            if (ext === 'tml') {
              ext = 'html'
            } else if (ext === 'peg') {
              ext = 'jpeg'
            }

            if (!ext) {
              throw new Error('File has no extension')
            }
            const ownerId = request.user._id
            const id = await this.repo.add({
              ownerId,
              path: ext,
              thumbPath: ext,
              size: file.size,
              mimetype: file.mimetype,
              md5: file.md5 as string,
              _id: undefined,
            })
            console.log('New media added to database', id)
            const filePath = getPathForMedia(ownerId, id, ext)
            const thumbPath = getPathForMediaThumb(ownerId, id)

            createMediaPathIfNotExists(ownerId)

            console.log('Going to move to path', filePath)
            file.mv(filePath, async (e) => {
              if (e) {
                console.error(e)
                await this.repo.delete(id)
              }
              filepreview.generate(
                filePath,
                thumbPath, (error: any) => {
                  if (error) {
                    return console.log(error)
                  }
                  console.log('File preview is' + thumbPath)
                })
              return response.send(id)
            })
          }

          // console.log('request', request)
          return
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    /**
     * Deletes a media file
     */
    this.router.delete(
      '/files/:mediaId',
      async (request: Request, response: Response) => {
        try {
          console.log('Media delete request', request.body)
          const id = request.params.mediaId
          const media = await this.repo.get(id)
          if (media === null) {
            return response.status(404).json({ error: 'Media item not found' })
          }
          if (!checkOwner(request, media)) {
            return response.status(401).json(
              { error: 'You do not have permission to edit this Media Item' })
          }
          await this.repo.delete(id)
          return response.json({ success: true })
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.put(
      '/files/:mediaId',
      async (request: Request, response: Response) => {
        try {
          console.log('Media edit request', request.body)
          const id = request.params.mediaId
          const media = await this.repo.get(id)
          if (media === null) {
            return response.status(404).json({ error: 'Media item not found' })
          }
          if (!checkOwner(request, media)) {
            return response.status(401).json(
              { error: 'You do not have permission to edit this Media Item' })
          }
          const resp = await this.repo.edit(id, { ...request.body })
          return response.json({ ...resp })
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.get(
      '/mine',
      async (request: Request, response: Response) => {
        try {
          const media = await this.repo.getAllByUser(request.user._id)
          const parsedMedia = loadRealPaths(media)
          return response.json(parsedMedia)

        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    return this.router
  }
}

// Since we only store the file extension in the database
// the rest of the path must be generated each time
// this allows the server to run in any set up without modding the data
export function loadRealPaths(media: MediaDocument[]): MediaDocument[] {
  return media.map(media => (media ? {
    ...media,
    // tslint:disable-next-line:max-line-length
    path: `${environment.api.publicUrl}/storage/${getPathForMedia(media.ownerId, media._id, media.path)}`,
    thumbPath:
      // tslint:disable-next-line:max-line-length
      `${environment.api.publicUrl}/storage/${getPathForMediaThumb(media.ownerId, media._id)}`,
  } : media))
}

const MEDIA_DIRECTORY = environment.api.mediaDir
function createMediaPathIfNotExists(ownerId: string): void {
  if (!fs.existsSync(MEDIA_DIRECTORY)) {
    fs.mkdirSync(MEDIA_DIRECTORY)
  }

  const userDir = `${MEDIA_DIRECTORY}/${ownerId}`
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir)
  }
}

function getPathForMedia(ownerId: string, mediaId: string, ext: string): string {
  return `${MEDIA_DIRECTORY}/${ownerId}/${mediaId}.${ext}`
}

function getPathForMediaThumb(ownerId: string, mediaId: string): string {
  return `${MEDIA_DIRECTORY}/${ownerId}/${mediaId}_thumb.png`
}
