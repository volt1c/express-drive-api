import { User } from '../users/user.model'
import bcrypt from 'bcrypt'
import { ServiceError } from '../typings'

export class AuthService {
  async register(name: string, pass: string) {
    const user = await User.findOne({ name }).exec()
    if (user)
      throw new ServiceError('this user already exist', 403)

    const hash = await bcrypt.hash(pass, 10)

    await User.create({ name, hash })
  }

  async login(name: string, pass: string) {
    const user = await User.findOne({ name }).exec()

    if (!user)
      throw new ServiceError('wrong username or password', 403)

    const hash = user.hash
    const isPasswordCorrect = await bcrypt.compare(pass, hash)
    if (!isPasswordCorrect)
      throw new ServiceError('wrong username or password', 403)

    return user._id
  }
}
