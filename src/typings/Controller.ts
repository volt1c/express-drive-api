import { RequestHandler, Router } from 'express'

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

export abstract class Controller {
  public abstract readonly path: string
  protected abstract readonly routes: IRoute[]
  private readonly router = Router()

  public setRoutes(): Router {
    for (const route of this.routes) {
      route.middlewares.forEach((middleware) => this.router.use(middleware))
      this.router[route.method](route.path, route.handler)
    }
    return this.router
  }
}
