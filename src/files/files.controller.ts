import { Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import {
  Controller,
  IRoute,
  Methods,
  ServiceError,
} from '../typings'
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

    try {
      const service = new FilesService()
      res.status(201).end(service.init(id))
    } catch (err) {
      if (err instanceof ServiceError)
        res.status(err.status).send(err.message)
      throw err
    }
  }

  makeDir(req: Request, res: Response) {
    const id = req.session['user']?.id
    if (!id) return res.status(401).send('unauthorized')

    const dir = req.body.path
    if (!dir) return res.status(400).send('no path')

    try {
      const service = new FilesService()
      res.status(201).end(service.makeDir(id, dir))
    } catch (err) {
      if (err instanceof ServiceError)
        res.status(err.status).send(err.message)
      throw err
    }
  }

  async upload(req: Request, res: Response) {
    if (typeof req.files?.file == 'object') {
      const id = req.session['user']?.id
      if (!id) return res.status(401).send('unauthorized')

      try {
        const file = req.files?.file as UploadedFile
        const service = new FilesService()
        res.status(201).end(await service.upload(id, file))
      } catch (err) {
        if (err instanceof ServiceError)
          res.status(err.status).send(err.message)
        throw err
      }
    }
    return res.status(400).end('faild')
  }

  download(req: Request, res: Response) {
    const id = req.session['user']?.id
    if (!id) return res.status(401).send('unauthorized')

    try {
      const path = (req.query?.path as string) ?? ''
      const service = new FilesService()
      const file = service.getFile(id, path)
      res.status(200).download(file)
    } catch (err) {
      if (err instanceof ServiceError)
        res.status(err.status).send(err.message)
      throw err
    }
  }

  getFiles(req: Request, res: Response) {
    const id = req.session['user']?.id
    if (!id) return res.status(401).send('unauthorized')

    try {
      const path = (req.query?.path as string) ?? ''
      const service = new FilesService()
      res.status(200).send(service.getFilesNames(id, path))
    } catch (err) {
      if (err instanceof ServiceError)
        res.status(err.status).send(err.message)
      throw err
    }
  }
}
