import express, { json, Request, Response } from 'express'
import compression from 'compression'
import { EventsService } from '../service/eventsService'
import { StudentContentService } from '../service/studentContentService'
import jwt from 'express-jwt'
import cors from 'cors'
import { AuthService } from '../service/authService'
import { check, validationResult } from 'express-validator'

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

  getAuthService(): AuthService {
    return this.authService
  }

  getEventsService(): EventsService {
    return this.eventsService
  }

  getStudentService(): StudentContentService {
    return this.studentService
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
    this.webServer.use(json())
    this.webServer.use(cors())

    this.registerRoutes()
  }

  registerRoutes(): void {
    this.webServer.get('/', (req, res) => {
      res.send('Root endpoint, to be later replaced by static serving')
    })

    authLogin(this)
    authSignupStudent(this)

    const apiRouter = express.Router()
    studentGetPages(this, apiRouter)

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

/* AUTH ENDPOINTS */

function authLogin(restServer: RestWebServer): void {
  restServer
    .getServer()
    .post(
      '/auth/login',
      [check('email').isEmail(), check('password').isLength({ min: 8 })],
      async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })
        const { email, password } = req.body

        const [token, error] = await restServer.getAuthService().login(email, password)
        if (error !== null) return res.status(401).json({ error: 'Unauthorized' })
        return res.status(200).json({ token })
      }
    )
}
function authSignupStudent(restServer: RestWebServer): void {
  restServer
    .getServer()
    .post(
      '/auth/signup',
      [
        check('fullName').isLength({ min: 3 }),
        check('university').isLength({ min: 3 }),
        check('matNumber').isAlphanumeric().isLength({ min: 3 }),
        check('email').isEmail(),
        check('password').isLength({ min: 8 })
      ],
      async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })
        const { fullName, university, matNumber, email, password } = req.body

        const [token, error] = await restServer
          .getAuthService()
          .studentSignup(fullName, email, password, university, matNumber)
        if (error !== null) return res.status(401).json({ error: 'Unauthorized' })
        return res.status(200).json({ token })
      }
    )
}

/* STUDENT CONTENT ENDPOINTS */

function studentGetPages(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/pages', (req: Request, res: Response) => {
    return res.status(400).json({ error: 'Invalid data' })
  })
}
