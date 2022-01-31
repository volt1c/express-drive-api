import { UploadedFile } from 'express-fileupload'
import { Service } from '../typings'

export class FilesService extends Service {
  upload(userId: string, file: UploadedFile): string {
    throw Error('Not implemented')
  }

  getFilePath(userId: string, fileName: string): string {
    throw Error('Not implemented')
  }

  getFilesNames(userId: string, path = ''): string[] {
    throw Error('Not implemented')
  }
}
