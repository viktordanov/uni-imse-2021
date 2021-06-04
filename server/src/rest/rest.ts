import express from 'express'
import compression from 'compression'
import { EventsService } from '../service/eventsService'
import { StudentContentService } from '../service/studentContentService'

export type RestConfig = {
  host: string
  port: string
  staticDir: string
}

export const DefaultRestConfig = (): RestConfig => ({ host: '127.0.0.1', port: '8080', staticDir: 'dist' })

export interface Rest {
  config: RestConfig
}

export class RestWebServer implements Rest {
  config: RestConfig
  private webServer: express.Express

  getServer(): express.Express {
    return this.webServer
  }

  constructor(config: RestConfig, eventsService: EventsService, studentService: StudentContentService) {
    this.config = config
    this.webServer = express()

    this.webServer.use(compression())

    this.registerRoutes()
  }

  registerRoutes(): void {
    this.webServer.get('/', (req, res) => {
      res.send('Root endpoint, to be later replaced by static serving')
    })

    const apiRouter = express.Router()
    apiRouter.get('/pages', (req, res) => {
      res.sendStatus(405)
    })
    apiRouter.get('/posts', (req, res) => {
      res.sendStatus(405)
    })
    apiRouter.get('/friends', (req, res) => {
      res.sendStatus(405)
    })
    this.webServer.use('/api', apiRouter)
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
