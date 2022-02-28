import { Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import { Controller, IRoute, Methods } from '../typings'
import { FilesService } from './files.service'

export class FilesController extends Controller<FilesService> {
  constructor(service: FilesService) {
    super(service)
  }

  public readonly path: string = '/files'
  protected routes: IRoute[] = [
    {
      path: '/upload',
      method: Methods.POST,
      handler: this.upload,
      middlewares: [fileUpload()],
    },
    {
      path: '/download',
      method: Methods.GET,
      handler: this.download,
      middlewares: [],
    },
    {
      path: '/get-files',
      method: Methods.GET,
      handler: this.getFiles,
      middlewares: [],
    },
  ]

  upload(req: Request, res: Response) {
    throw Error('Not implemented')
  }

  download(req: Request, res: Response) {
    throw Error('Not implemented')
  }

  getFiles(req: Request, res: Response) {
    throw Error('Not implemented')
  }
}
