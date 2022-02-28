import { RequestHandler, Router } from 'express'
import { Service } from '.'

export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  HEAD = 'head',
}

export type IRoute = {
  path: string
  method: Methods
  handler: RequestHandler
  middlewares: RequestHandler[]
}

export abstract class Controller<T extends Service = Service> {
  constructor(service?: T) {
    this.service = service
  }

  public abstract readonly path: string
  protected readonly service: T | undefined
  protected abstract readonly routes: IRoute[]
  private readonly router = Router()

  public setRoutes(): Router {
    for (const route of this.routes) {
      for (const middleware in route.middlewares) {
        this.router.use(middleware)
      }
      this.router[route.method](route.path, route.handler)
    }
    return this.router
  }
}
