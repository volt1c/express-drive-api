import { existsSync, readFileSync, unlinkSync } from 'fs'
import mockFs from 'mock-fs'
import { FilesService } from '../../src/files/files.service'
import { mockUploadedFile } from './files.mock'

describe('FilesService', () => {
  let service: FilesService

  beforeEach(() => {
    service = new FilesService()
    mockFs({
      'storage/testId': {
        'testFile.txt': 'some string',
        subfolder: { 'subFile.txt': 'another string' },
      },
    })
  })

  afterEach(() => mockFs.restore())

  describe('mocks', () => {
    it('testFile should exist', () => {
      const file = `${process.cwd()}/storage/testId/testFile.txt`
      const expected = `some string`

      const result = readFileSync(file, 'utf8')
      expect(result).toEqual(expected)
    })

    it('service should be defined', () => {
      expect(service).toBeDefined()
    })
  })

  describe('upload', () => {
    it('should upload file', () => {
      const resp = service.upload('testId', mockUploadedFile)
      const file = `${process.cwd()}/storage/testId/mockFile.txt`
      const wasSaved = existsSync(file)

      if (wasSaved) unlinkSync(file)

      expect(resp).toEqual('file succesfully uploaded')
      expect(wasSaved).toBeTruthy()
    })

    it('should throw Error', () => {
      const fn = () => service.upload('fakeTestId', mockUploadedFile)

      expect(fn).toThrowError()
    })
  })

  describe('getFilePath', () => {
    it('should get path to file', () => {
      const pathToFile = service.getFilePath('testId', 'testFile.txt')

      let text = '>> no such file'
      if (existsSync(pathToFile)) text = readFileSync(pathToFile, 'utf8')

      expect(text).toEqual('some string')
    })

    it('should throw error `file not found`', () => {
      const fn = () => service.getFilePath('testId', 'fakeFile.txt')

      expect(fn).toThrowError('file not found')
    })
  })

  describe('getFilesNames', () => {
    it('should get files names from main directory', () => {
      const resp = service.getFilesNames('userId')

      expect(resp).toEqual(['testFile.txt'])
    })

    it('should get files names from subdirectory', () => {
      const resp = service.getFilesNames('userId', 'subfolder')

      expect(resp).toEqual(['..', 'subFile.txt'])
    })
  })
})
