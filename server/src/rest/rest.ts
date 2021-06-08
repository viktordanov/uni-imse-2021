import express, { Request, Response } from 'express'
import compression from 'compression'
import { EventsService } from '../service/eventsService'
import { StudentContentService } from '../service/studentContentService'
import jwt from 'express-jwt'
import { AuthService } from '../service/authService'

export type RestConfig = {
  host: string
  port: string
  staticDir: string
  jwtSecret: string
}

export const DefaultRestConfig = (): RestConfig => ({
  host: '127.0.0.1',
  port: '8080',
  staticDir: 'dist',
  jwtSecret: 'DEBUG'
})

export interface Rest {
  config: RestConfig
}

export class RestWebServer implements Rest {
  config: RestConfig
  private webServer: express.Express
  private authService: AuthService
  private eventsService: EventsService
  private studentService: StudentContentService

  getServer(): express.Express {
    return this.webServer
  }

  constructor(
    config: RestConfig,
    authService: AuthService,
    eventsService: EventsService,
    studentService: StudentContentService
  ) {
    this.config = config
    this.authService = authService
    this.eventsService = eventsService
    this.studentService = studentService

    this.webServer = express()

    this.webServer.use(compression())

    this.registerRoutes()
  }

  registerRoutes(): void {
    this.webServer.get('/', (req, res) => {
      res.send('Root endpoint, to be later replaced by static serving')
    })

    this.webServer.post('/auth/login', (req, res) => {
      // req.body.
    })

    const apiRouter = express.Router()

    this.webServer.use('/api', jwt({ secret: this.config.jwtSecret, algorithms: ['HS256'] }), apiRouter)
    this.webServer.use((err: Error, req: Request, res: Response) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send('')
      }
    })
  }

  serve(): void {
    this.webServer.listen(this.config.port, () => {
      console.log(`REST API Web Server listening at http://${this.config.host}:${this.config.port}`)
    })
  }

  serverHTTPS(): void {
    throw new Error('To be implemented')
  }
}
