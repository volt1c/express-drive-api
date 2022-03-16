import { Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import { Controller, IRoute, Methods } from '../typings'
import { FilesService } from './files.service'

export class FilesController extends Controller {
  public readonly path: string = '/files'
  protected routes: IRoute[] = [
    {
      path: '/init',
      method: Methods.POST,
      handler: this.init,
      middlewares: [],
    },
    {
      path: '/mkdir',
      method: Methods.POST,
      handler: this.makeDir,
      middlewares: [],
    },
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
      path: '/list',
      method: Methods.GET,
      handler: this.getFiles,
      middlewares: [],
    },
  ]

  init(req: Request, res: Response) {
    const id = req.session['user']?.id
    if (!id) return res.status(401).send('unauthorized')
    const service = new FilesService()
    res.status(201).end(service.init(id))
  }

  makeDir(req: Request, res: Response) {
    const id = req.session['user']?.id
    const dir = req.body.path
    if (!id) return res.status(401).send('unauthorized')
    if (!id) return res.status(400).send('no path')
    const service = new FilesService()
    res.status(201).end(service.makeDir(id, dir))
  }

  async upload(req: Request, res: Response) {
    if (typeof req.files?.file == 'object') {
      const id = req.session['user']?.id
      if (!id) return res.status(401).send('unauthorized')
      const file = req.files?.file as UploadedFile
      const service = new FilesService()
      res.status(201).end(await service.upload(id, file))
    }
    return res.status(400).end('faild')
  }

  download(req: Request, res: Response) {
    const id = req.session['user']?.id
    if (!id) return res.status(401).send('unauthorized')
    const path = req.query?.path ?? ''
    const service = new FilesService()
    const file = service.getFile(id, path as string)
    return res.status(200).download(file)
  }

  getFiles(req: Request, res: Response) {
    const id = req.session['user']?.id
    if (!id) return res.status(401).send('unauthorized')
    const path = req.query?.path ?? ''
    const service = new FilesService()
    const names = service.getFilesNames(id, path as string)
    res.status(200).send(names)
  }
}
