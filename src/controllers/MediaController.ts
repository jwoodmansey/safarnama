import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { checkOwner } from '../utils/auth'
import * as fs from 'fs'
// @ts-ignore
import * as filepreview from 'filepreview'
import { MediaRepo } from '../model/repo/MediaRepo'
import { MediaDocument } from '@common/media'
import { environment } from '../config/env'

interface UploadedFileExtended extends UploadedFile {
  md5: string,
  size: number,
}

export async function processUpload(request: Request, response: Response) {
  const repo = new MediaRepo()
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

      const ext = getExtension(file)
      const ownerId = request.user._id
      const id = await repo.add({
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
          await repo.delete(id)
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
    return
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function editMedia(request: Request, response: Response) {
  try {
    const repo = new MediaRepo()
    console.log('Media edit request', request.body)
    const id = request.params.mediaId
    const media = await repo.get(id)
    if (media === null) {
      return response.status(404).json({ error: 'Media item not found' })
    }
    if (!checkOwner(request, media)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Media Item' })
    }
    if (request.files && Object.keys(request.files).length > 0 &&
      request.files.filepond && Object.keys(request.files.filepond).length > 0) {

      const file: UploadedFileExtended = request.files.filepond as UploadedFileExtended
      const ext = getExtension(file)
      const ownerId = request.user._id
      const filePath = getPathForMedia(ownerId, id, ext)
      console.log('Going to move to path', filePath)
      file.mv(filePath, async (e) => {
        if (e) {
          return response.status(500).send('File not found')
        }
        return response.json({})
      })
    } else {
      const resp = await repo.edit(id, { ...request.body })
      return response.json({ ...resp })
    }
    return
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function deleteMedia(request: Request, response: Response) {
  const repo = new MediaRepo()
  try {
    console.log('Media delete request', request.body)
    const id = request.params.mediaId
    const media = await repo.get(id)
    if (media === null) {
      return response.status(404).json({ error: 'Media item not found' })
    }
    if (!checkOwner(request, media)) {
      return response.status(401).json(
        { error: 'You do not have permission to edit this Media Item' })
    }
    // Todo delete the file
    await repo.delete(id)
    return response.json({ success: true })
  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
  }
}

export async function getMine(request: Request, response: Response) {
  const repo = new MediaRepo()
  try {
    const media = await repo.getAllByUser(request.user._id)
    const parsedMedia = loadRealPaths(media)
    return response.json(parsedMedia)

  } catch (e) {
    return response.status(500).json({ code: 500, error: e })
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

function getExtension(file: UploadedFileExtended): string {
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
  return ext
}
