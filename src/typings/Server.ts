import { Application, RequestHandler } from 'express'
import { Controller } from '.'
import http from 'http'

export class Server {
  constructor(
    private readonly app: Application,
    private readonly port: number
  ) {}

  public hideExpress() {
    this.app.disable('x-powered-by')
  }

  public loadMiddlewares(middlewares: RequestHandler[]): void {
    middlewares.forEach((middleware) =>
      this.app.use(middleware)
    )
  }

  public loadControllers(controllers: Controller[]) {
    this.app.head('/', (req, res) => res.status(200).end())

    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes())
    })
  }

  run(): { server: http.Server; app: Application } {
    return {
      server: this.app.listen(this.port),
      app: this.app,
    }
  }
}
