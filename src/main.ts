import bodyParser from 'body-parser'
import express, { Application, RequestHandler } from 'express'
import { Controller, Server } from './typings'
import { FilesController } from './files/files.controller'
import config from './config'
import mongoose from 'mongoose'

config()

const app: Application = express()

const controllers: Controller[] = [new FilesController()]
const middlewares: RequestHandler[] = [bodyParser.json()]

const mongoUri: string = process.env.MONGO_URI as string
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = new Server(app, port)

server.loadControllers(controllers)
server.loadMiddlewares(middlewares)

mongoose
  .connect(mongoUri)
  .then(() => {
    console.info('Mongoose is connected')
    server.run()
    console.info('Server is listening')
  })
  .catch((err) => console.error(err))
