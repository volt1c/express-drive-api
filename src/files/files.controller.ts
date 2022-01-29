import { Controller, IRoute, Methods, Service } from '../typings'

export class FilesController extends Controller {
  constructor(service: Service) {
    super(service)
  }

  public readonly path: string = '/files'
  protected routes: IRoute[] = []
}
