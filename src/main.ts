import express, { Application, RequestHandler } from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import { Controller, Server } from './typings'
import { FilesController } from './files/files.controller'
import { AuthController } from './auth/auth.controller'
import { connect } from 'mongoose'
import { config } from './config'

const app: Application = express()

const controllers: Controller[] = [
  new FilesController(),
  new AuthController(),
]
const middlewares: RequestHandler[] = [
  bodyParser.json(),
  session(config.session),
]

const server = new Server(app, config.server.port)

server.hideExpress()
server.loadMiddlewares(middlewares)
server.loadControllers(controllers)

connect(config.mongoose.uri)
  .then(() => {
    console.info('Mongoose is connected')
    server.run()
    console.info('Server is listening')
  })
  .catch((err) => console.error(err))
