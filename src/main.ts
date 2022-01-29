import bodyParser from 'body-parser'
import express, { Application, RequestHandler } from 'express'
import { Controller, Server } from './typings'

const app: Application = express()

const controllers: Controller[] = []
const middlewares: RequestHandler[] = [bodyParser.json()]

const server = new Server(app, 8080)

server.loadControllers(controllers)
server.loadMiddlewares(middlewares)

server.run()
