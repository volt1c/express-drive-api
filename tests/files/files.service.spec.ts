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

    it("should throw Error `dir for this user doesn't exist`", () => {
      const fn = () => service.upload('fakeId', mockUploadedFile)

      expect(fn).toThrowError("dir for this user doesn't exist")
    })
  })

  describe('getFile', () => {
    it('should get correct path', () => {
      const pathToFile = service.getFile('testId', 'testFile.txt')

      expect(existsSync(pathToFile)).toBeTruthy()
    })

    it('should get correct file content', () => {
      const pathToFile = service.getFile('testId', 'testFile.txt')

      let text = 'no file'
      if (existsSync(pathToFile)) text = readFileSync(pathToFile, 'utf8')

      expect(text).toEqual('some string')
    })

    it("should throw error `dir for this user doesn't exist`", () => {
      const fn = () => service.getFile('fakeId', 'fakeFile.txt')

      expect(fn).toThrowError("dir for this user doesn't exist")
    })

    it("should throw error `this path doesn't exist`", () => {
      const fn = () => service.getFile('testId', 'fakeFile.txt')

      expect(fn).toThrowError("this path doesn't exist")
    })
  })

  describe('getFilesNames', () => {
    it('should get files names from main directory', () => {
      const resp = service.getFilesNames('testId')

      expect(resp).toEqual(['subfolder', 'testFile.txt'])
    })

    it('should get files names from subdirectory', () => {
      const resp = service.getFilesNames('testId', 'subfolder')

      expect(resp).toEqual(['..', 'subFile.txt'])
    })

    it("should throw Error `dir for this user doesn't exist`", () => {
      const fn = () => service.getFilesNames('fakeId')

      expect(fn).toThrowError("dir for this user doesn't exist")
    })

    it("should throw Error `this path doesn't exist`", () => {
      const fn = () => service.getFilesNames('testId', 'fakeSubfolder')

      expect(fn).toThrowError("this path doesn't exist")
    })

    it('should throw Error `access denied`', () => {
      const fn = () => service.getFilesNames('testId', '../fakeId')

      expect(fn).toThrowError('access denied')
    })
  })
})
