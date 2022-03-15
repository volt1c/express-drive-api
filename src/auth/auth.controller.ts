import { Controller, IRoute, Methods } from '../typings'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../users/user.model'

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

    const user = await User.findOne({ name }).exec()
    if (!user) return res.status(403).send('wrong username or password')

    const hash = user.hash
    const isPasswordCorrect = await bcrypt.compare(pass, hash)
    if (!isPasswordCorrect)
      return res.status(403).send('wrong username or password')

    req.session['user'] = {
      id: user._id,
    }
    res.status(200).send('success')
  }

  async register(req: Request, res: Response) {
    const { name, pass } = req.body

    const user = await User.findOne({ name }).exec()
    if (!user) return res.status(403).send('this user already exist')

    const hash = await bcrypt.hash(pass, 10)

    await User.create({ name, hash })

    res.status(201).send('user created')
  }
}
