import { Application, RequestHandler } from 'express'
import { Controller } from '.'

export class Server {
  constructor(
    private readonly app: Application,
    private readonly port: number
  ) {}

  public loadMiddlewares(middlewares: RequestHandler[]): void {
    middlewares.forEach((middleware) => this.app.use(middleware))
  }

  public loadControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes())
    })
  }

  run() {
    this.app.listen(this.port)
  }
}
