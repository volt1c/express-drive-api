import { UploadedFile } from 'express-fileupload'
import { existsSync, readdirSync } from 'fs'
import { isAbsolute, join } from 'path'
import { relative } from 'path/posix'
import { Service } from '../typings'

export class FilesService extends Service {
  upload(userId: string, file: UploadedFile, path = ''): string {
    throw Error('Not implemented')
  }

  getFile(userId: string, filePath: string): string {
    throw Error('Not implemented')
  }

  getFilesNames(userId: string, path = ''): string[] {
    const storageDir = join(process.cwd(), 'storage')
    const userStorageDir = join(storageDir, userId)
    const pathToDir = join(userStorageDir, path)
    const isPathSubDir = this.isSubDir(userStorageDir, pathToDir)

    if (!['', '/'].includes(path) && !isPathSubDir)
      throw new Error('access denied')
    if (!existsSync(userStorageDir))
      throw new Error("dir for this user doesn't exist")
    if (!existsSync(pathToDir)) throw new Error("this path doesn't exist")

    const dir = readdirSync(pathToDir)

    if (isPathSubDir) dir.unshift('..')

    return dir
  }

  private isSubDir(parent: string, dir: string): boolean {
    const rel = relative(
      parent.replaceAll('\\', '/'),
      dir.replaceAll('\\', '/')
    )
    return !!rel && !rel.startsWith('..') && !isAbsolute(rel)
  }
}
