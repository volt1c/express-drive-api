import bodyParser from 'body-parser'
import express, { Application, RequestHandler } from 'express'
import { Controller, Server } from './typings'
import { FilesController } from './files/files.controller'
import { FilesService } from './files/files.service'

const app: Application = express()

const controllers: Controller[] = [new FilesController(new FilesService())]
const middlewares: RequestHandler[] = [bodyParser.json()]

const server = new Server(app, 8080)

server.loadControllers(controllers)
server.loadMiddlewares(middlewares)

server.run()
