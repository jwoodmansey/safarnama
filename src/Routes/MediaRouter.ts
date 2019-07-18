import { Router } from 'express'

import { processUpload, deleteMedia, getMine, editMedia } from '../controllers/MediaController'

export class MediaRouter {

  private router: Router = Router()

  getRouter(): Router {

    /**
     * Upload new Media
     */
    this.router.post('/process', processUpload)

    /**
     * Deletes a media file
     */
    this.router.delete('/files/:mediaId', deleteMedia)

    /**
     * Allows setting of media metadata, OR entire replacement of a media file
     */
    this.router.put('/files/:mediaId', editMedia)

    /**
     * Returns all media for the auth'd user
     */
    this.router.get('/mine', getMine)

    return this.router
  }
}
