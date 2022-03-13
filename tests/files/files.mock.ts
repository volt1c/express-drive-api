import { UploadedFile } from 'express-fileupload'
import fileFactory from 'express-fileupload/lib/fileFactory'

export const mockUploadedFile: UploadedFile = fileFactory(
  {
    name: 'mockFile.txt',
    buffer: Buffer.from('mock string', 'utf8'),
    size: Buffer.byteLength('mock string', 'utf8'),
    encoding: 'utf8',
    truncated: false,
    mimetype: 'text/plain',
  },
  {
    useTempFiles: false,
  }
)
