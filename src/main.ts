import express, { Application, RequestHandler } from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import { Controller, Server } from './typings'
import { FilesController } from './files/files.controller'
import { AuthController } from './auth/auth.controller'
import { connect } from 'mongoose'
import config from './config'

config()

const app: Application = express()

const controllers: Controller[] = [new FilesController(), new AuthController()]
const middlewares: RequestHandler[] = [
  bodyParser.json(),
  session({
    secret: 'secret',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
]

const mongoUri: string = process.env.MONGO_URI as string
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = new Server(app, port)

server.loadControllers(controllers)
server.loadMiddlewares(middlewares)

connect(mongoUri)
  .then(() => {
    console.info('Mongoose is connected')
    server.run()
    console.info('Server is listening')
  })
  .catch((err) => console.error(err))
