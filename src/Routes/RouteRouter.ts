import { RouteDocument } from '@common/route'
import { Request, Response, Router } from 'express'
import { check, validationResult } from 'express-validator/check'
import { checkOwner } from '../utils/auth'
import { RouteRepo } from '../model/repo/RouteRepo'

export class RouteRouter {

  private router: Router = Router()

  getRouter(): Router {
    const repo = new RouteRepo()

    /**
     * Create a new PointOfInterest
     */
    this.router.post(
      '',
      [
        // TODO validation
        check('name').isString().isLength({ max: 32 }).escape().trim(),
        check('colour').isString().isLength({ max: 32 }).escape().trim(),
        // check('name').isString().isLength({ max: 32 }),
      ],
      async (request: Request, response: Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
          return response.status(422).json({ errors: errors.array() })
        }

        console.log('User', request.user)
        const routeData: RouteDocument = {
          ...request.body,
          createdAt: new Date(),
          ownerId: request.user._id,
        }
        try {
          const res = await repo.add(routeData)
          return response.json(res)
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.put(
        '/:routeId',
        async (request: Request, response: Response) => {
          const errors = validationResult(request)
          if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
          }

          try {
            const route = await repo.getModel(request.params.routeId)
            if (route === null) {
              return response.status(404).json({ error: 'Route not found' })
            }
            if (!checkOwner(request, route)) {
              return response.status(401).json(
                { error: 'You do not have permission to edit this Route' })
            }
            route.set({ ...request.body, updatedAt: new Date() })
            const dbResp = await route.save()
            return response.json(dbResp.toJSON())
          } catch (e) {
            response.statusCode = 500
            return response.json({ code: 500, error: e })
          }
        })

    this.router.delete(
          '/:routeId',
          async (request: Request, response: Response) => {
            try {
              const route = await repo.getModel(request.params.routeId)
              if (route === null) {
                return response.status(404).json({ error: 'Route not found' })
              }
              if (!checkOwner(request, route)) {
                return response.status(401).json(
                  { error: 'You do not have permission to delete this Route' })
              }
              await route.remove()
              return response.json({ success: true })
            } catch (e) {
              response.statusCode = 500
              return response.json({ code: 500, error: e })
            }
          })

    return this.router
  }
}
