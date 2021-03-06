import { UploadedFile } from 'express-fileupload'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { isAbsolute, join } from 'path'
import { relative } from 'path/posix'
import { ServiceError } from '../typings'

export class FilesService {
  private readonly storageDir = join(process.cwd(), 'storage')

  init(userId: string) {
    const aim = join(this.storageDir, userId)

    if (existsSync(aim))
      throw new ServiceError('already exist', 400)

    mkdirSync(aim, { recursive: true })
    return 'created'
  }

  makeDir(userId: string, path: string) {
    const userDir = join(this.storageDir, userId)
    const aim = join(userDir, path)

    if (!this.isSubDir(userDir, aim))
      throw new ServiceError('incorrect path', 400)

    if (existsSync(aim))
      throw new ServiceError('already exist', 400)

    mkdirSync(aim, { recursive: true })
    return 'created'
  }

  async upload(
    userId: string,
    file: UploadedFile,
    path = ''
  ): Promise<string> {
    const aim = this.validatePathData(userId, path)

    await file.mv(join(aim, file.name))

    return 'file succesfully uploaded'
  }

  getFile(userId: string, path: string): string {
    return this.validatePathData(userId, path)
  }

  getFilesNames(userId: string, path = ''): string[] {
    const dir = this.validatePathData(userId, path)

    const userStorage = join(this.storageDir, userId)
    const isPathSubDir = this.isSubDir(userStorage, dir)

    const contents = readdirSync(dir)

    if (isPathSubDir) contents.unshift('..')

    return contents
  }

  private isSubDir(parent: string, dir: string): boolean {
    const rel = relative(
      parent.replaceAll('\\', '/'),
      dir.replaceAll('\\', '/')
    )
    return !!rel && !rel.startsWith('..') && !isAbsolute(rel)
  }

  private validatePathData(
    userId: string,
    path: string
  ): string | never {
    const userStorage = join(this.storageDir, userId)
    const fileOrDir = join(userStorage, path)

    const isSubDir =
      ['', '/'].includes(path) ||
      this.isSubDir(userStorage, fileOrDir)
    if (!isSubDir) throw new ServiceError('access denied', 400)

    const isThereStorageForThisId = existsSync(userStorage)
    if (!isThereStorageForThisId)
      throw new ServiceError(
        "dir for this user doesn't exist",
        400
      )

    const isThereFileOrDir = existsSync(fileOrDir)
    if (!isThereFileOrDir)
      throw new ServiceError("this path doesn't exist", 400)

    return fileOrDir
  }
}
