import {
  Controller,
  IRoute,
  Methods,
  ServiceError,
} from '../typings'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

export class AuthController extends Controller {
  public readonly path: string = '/auth'
  protected routes: IRoute[] = [
    {
      path: '/login',
      method: Methods.POST,
      handler: this.login,
      middlewares: [],
    },
    {
      path: '/register',
      method: Methods.POST,
      handler: this.register,
      middlewares: [],
    },
  ]

  async login(req: Request, res: Response) {
    const { name, pass } = req.body

    try {
      const service = new AuthService()
      req.session['user'] = {
        id: service.login(name, pass),
      }
      res.status(200).send('success')
    } catch (err) {
      if (err instanceof ServiceError)
        res.status(err.status).send(err.message)
      throw err
    }
  }

  async register(req: Request, res: Response) {
    const { name, pass } = req.body

    try {
      new AuthService().register(name, pass)
      res.status(201).send('user created')
    } catch (err) {
      if (err instanceof ServiceError)
        res.status(err.status).send(err.message)
      throw err
    }
  }
}
