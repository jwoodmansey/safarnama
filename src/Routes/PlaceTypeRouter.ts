import { PlaceType } from '@common/point-of-interest'
import { Request, Response, Router } from 'express'
import { PlaceTypeRepo } from '../model/repo/PlaceTypeRepo'

export class PlaceTypeRouter {

  private router: Router = Router()

  getRouter(): Router {
    const repo = new PlaceTypeRepo()

    /**
     * Create a new PlaceType
     */
    this.router.post(
      '',
      async (request: Request, response: Response) => {
        const type: PlaceType = {
          ...request.body,
          createdAt: new Date(),
          ownerId: request.user._id,
        }
        try {
          const res = await repo.add(type)
          return response.json(res)
        } catch (e) {
          response.statusCode = 500
          return response.json({ code: 500, error: e })
        }
      })

    this.router.get('', async (request: any, response: Response) => {
      const data: PlaceType[] = await repo.getAllByUser(request.user._id)
      return response.json(data)
    })

    return this.router
  }
}
