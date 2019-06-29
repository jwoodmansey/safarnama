import { PointOfInterestDocument } from '@common/point-of-interest'
import { Router, Request, Response } from 'express'
import { validationResult, check } from 'express-validator/check'
import { PointOfInterestRepo } from '../model/repo/PointOfInterestRepo'
import { checkOwner } from '../utils/auth'
import { MediaDocument } from '@common/media'
import { loadRealPaths } from './MediaRouter'

export class PointOfInterestRouter {

  private router: Router = Router()

  getRouter(): Router {
    const repo = new PointOfInterestRepo()

    /**
     * Create a new PointOfInterest
     */
    this.router.post(
      '',
      [
        // TODO validation
        check('name').isString().isLength({ max: 32 }).escape().trim(),
        check('location').not().isEmpty(),
        // check('name').isString().isLength({ max: 32 }),
      ],
      async (request: Request, response: Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
          return response.status(422).json({ errors: errors.array() })
        }

        console.log('User', request.user)
        const poiData: PointOfInterestDocument = {
          ...request.body,
          createdAt: new Date(),
          ownerId: request.user._id,
        }
        try {
          const res = await repo.addNewPointOfInterest(poiData)
          loadRealMediaPaths(res)
          return response.json(res)
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.put(
      '/:poiId',
      async (request: Request, response: Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
          return response.status(422).json({ errors: errors.array() })
        }

        try {
          const poi = await repo.getModel(request.params.poiId)
          if (poi === null) {
            return response.status(404).json({ error: 'Point of interest not found' })
          }
          if (!checkOwner(request, poi)) {
            return response.status(401).json(
              { error: 'You do not have permission to edit this Point of Interest' })
          }
          let mediaIds: string[] = []
          if (request.body.media) {
            mediaIds = request.body.media.map((media: MediaDocument) => media._id)
            delete request.body.media
          }
          poi.set({ ...request.body, media: mediaIds, updatedAt: new Date() })
          const pop = (await poi.save()).populate('media')
          const resp = await pop.execPopulate()
          const obj = resp.toObject()
          loadRealMediaPaths(obj)
          return response.json(obj)
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.delete(
      '/:poiId',
      async (request: Request, response: Response) => {
        try {
          const poi = await repo.getModel(request.params.poiId)
          if (poi === null) {
            return response.status(404).json({ error: 'Point of interest not found' })
          }
          if (!checkOwner(request, poi)) {
            return response.status(401).json(
              { error: 'You do not have permission to delete this Point of Interest' })
          }
          await poi.remove()
          return response.json({ success: true })
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    return this.router
  }
}

function loadRealMediaPaths(poi: PointOfInterestDocument): void {
  if (poi.media) {
    poi.media = loadRealPaths(poi.media)
  }
}
