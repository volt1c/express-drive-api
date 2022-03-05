import { Controller, IRoute } from '../typings'

export class FilesController extends Controller {
  public readonly path: string = '/files'
  protected routes: IRoute[] = []
}
