import { Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import { Controller, IRoute, Methods } from '../typings'
import { FilesService } from './files.service'

export class FilesController extends Controller {
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
    if (typeof req.files?.file == 'object') {
      const id = 'test' // req.user.id
      const file = req.files?.file as UploadedFile
      const service = new FilesService()
      res.status(201).end(service.upload(id, file))
    }
    return res.status(400).end('faild')
  }

  download(req: Request, res: Response) {
    const id = 'test' // req.user.id
    const path = req.query?.path ?? ''
    const service = new FilesService()
    const file = service.getFile(id, path as string)
    return res.status(200).download(file)
  }

  getFiles(req: Request, res: Response) {
    const id = 'test' // req.user.id
    const path = req.query?.path ?? ''
    const service = new FilesService()
    const names = service.getFilesNames(id, path as string)
    res.status(200).send(names)
  }
}
