import express, { Application } from 'express'
import * as Server from '@Servers/Server'

const app: Application = express()

Server.initServer(app, __dirname)
Server.startServer(app)
