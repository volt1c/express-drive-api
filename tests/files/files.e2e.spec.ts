import express, { Application, RequestHandler } from 'express'
import { Controller, Server } from '../../src/typings'
import supertest from 'supertest'
import bodyParser from 'body-parser'
import { FilesController } from '../../src/files/files.controller'
import { FilesService } from '../../src/files/files.service'
import http from 'http'

describe('Files e2e', () => {
  let app: Application
  let server: http.Server
  let request

  beforeAll(() => {
    const controllers: Controller[] = [new FilesController(new FilesService())]
    const middlewares: RequestHandler[] = [bodyParser.json()]

    const api = new Server(express(), 8080)

    api.loadControllers(controllers)
    api.loadMiddlewares(middlewares)

    const appInstaces = api.run()

    app = appInstaces.app
    server = appInstaces.server

    request = supertest(app)
  })

  afterAll(() => {
    server.close()
  })

  describe('mocks', () => {
    it('api should be defined', () => {
      expect(app).toBeDefined()
    })
  })

  describe('/', () => {
    it('should response with code 200', async () => {
      const res = await request.head('/')

      expect(res.status).toBe(200)
    })
  })
})
