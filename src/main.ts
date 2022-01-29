import bodyParser from 'body-parser'
import express, { Application, RequestHandler } from 'express'
import { Controller, Server } from './typings'
import { FilesController } from './files/files.controller'
import { FilesService } from './files/files.service'
import config from './config'

config()

const app: Application = express()

const controllers: Controller[] = [new FilesController(new FilesService())]
const middlewares: RequestHandler[] = [bodyParser.json()]

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = new Server(app, port)

server.loadControllers(controllers)
server.loadMiddlewares(middlewares)

server.run()
