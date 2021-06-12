import compression from 'compression'
import cors from 'cors'
import express, { json, Request, Response } from 'express'
import jwt from 'express-jwt'
import { check, validationResult } from 'express-validator'
import { Page, Post } from '../entities/entities'
import { AuthService } from '../service/authService'
import { EventsService } from '../service/eventsService'
import { StudentContentService } from '../service/studentContentService'

type PagePayload = {
  title: string
  description: string
  dateCreated: Date
  ownerName: string
  postCount: number
}

type PostPayload = {
  title: string
  content: string
  dateCreated: Date
  ownerName: string
  pageTitle: string
}

type FollowedStudentPayload = {
  name: string
  email: string
  university: string
}

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
    getPages(this, apiRouter)
    getPagesOfStudentByEmail(this, apiRouter)
    addPage(this, apiRouter)
    removePage(this, apiRouter)
    getAllStudents(this, apiRouter)
    getAllFollowedStudents(this, apiRouter)
    followStudentByEmail(this, apiRouter)
    unfollowStudentByEmail(this, apiRouter)
    getFeedPosts(this, apiRouter)
    addPost(this, apiRouter)
    getPosts(this, apiRouter)
    likePost(this, apiRouter)
    unlikePost(this, apiRouter)

    this.webServer.use('/api', jwt({ secret: this.config.jwtSecret, algorithms: ['HS256'] }), apiRouter)
    this.webServer.use((err: Error, req: Request, res: Response) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'Unauthorized' })
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
        if (error !== null) return res.status(401).json({ error: error.message })
        return res.status(200).json({ token })
      }
    )
}

/* STUDENT CONTENT ENDPOINTS */

function getPages(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/pages', async (req: Request, res: Response) => {
    const studentID = getIdFromDecodedToken(req)
    const [pages, err] = await restServer.getStudentService().getPagesOfStudent(studentID)
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }

    const [student, errStu] = await restServer.getStudentService().getStudentById(studentID)
    if (errStu !== null) {
      return res.status(400).json({ error: errStu.message })
    }

    const pagesPayload: PagePayload[] = pages.map<PagePayload>(p => {
      return { ...p, postCount: 0, ownerName: student.name }
    })

    let i = 0
    for (const page of pages) {
      const [posts, errPosts] = await restServer.getStudentService().getPostsOfPage(studentID, page.title)
      if (errPosts !== null) {
        return res.status(400).json({ error: errPosts.message })
      }
      pagesPayload[i++].postCount = posts.length
    }

    return res.status(200).json(pagesPayload)
  })
}
function getPagesOfStudentByEmail(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/pages/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    if (email === null || email.length < 3) {
      return res.status(400).json({ error: 'page title missing or too short' })
    }

    const studentID = getIdFromDecodedToken(req)
    const [followed, errFollowed] = await restServer.getStudentService().getFollowed(studentID)
    if (errFollowed !== null) {
      return res.status(400).json({ error: errFollowed.message })
    }

    if (followed.findIndex(student => student.email === email) === -1) {
      return res.status(400).json({ error: 'requester does not follow a student with the given email' })
    }

    const [student, errStu] = await restServer.getStudentService().getStudentByEmail(email)
    if (errStu !== null) {
      return res.status(400).json({ error: errStu.message })
    }

    const [pages, err] = await restServer.getStudentService().getPagesOfStudent(student.id)
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }

    const pagesPayload: PagePayload[] = pages.map<PagePayload>(p => {
      return { ...p, postCount: 0, ownerName: student.name }
    })

    let i = 0
    for (const page of pages) {
      const [posts, errPosts] = await restServer.getStudentService().getPostsOfPage(student.id, page.title)
      if (errPosts !== null) {
        return res.status(400).json({ error: errPosts.message })
      }
      pagesPayload[i++].postCount = posts.length
    }

    return res.status(200).json(pagesPayload)
  })
}

function addPage(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.post(
    '/pages',
    [check('title').isLength({ min: 3, max: 150 }), check('description').isLength({ min: 3, max: 300 })],
    async (req: Request, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })

      const { title, description } = req.body

      const page: Page = { title, description, dateCreated: new Date() }
      const studentID = getIdFromDecodedToken(req)
      const err = await restServer.getStudentService().addPageToStudent(studentID, page)
      if (err !== null) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({ status: 'OK' })
    }
  )
}

function removePage(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.delete('/pages', [check('title').isLength({ min: 3, max: 150 })], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })

    const { title } = req.body

    const studentID = getIdFromDecodedToken(req)
    const err = await restServer.getStudentService().removePageFromStudent(studentID, title)
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }
    return res.status(200).json({ status: 'OK' })
  })
}
function getAllStudents(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/students', async (req: Request, res: Response) => {
    const [me, err2] = await restServer.getStudentService().getStudentById(getIdFromDecodedToken(req))
    if (err2 !== null) {
      return res.status(403).json({ error: err2.message })
    }

    const [students, err] = await restServer.getStudentService().getAllStudents()
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }

    return res.status(200).json(students.filter(s => s.id !== me.id))
  })
}

function getAllFollowedStudents(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/followed', async (req: Request, res: Response) => {
    const [followed, err] = await restServer.getStudentService().getFollowed(getIdFromDecodedToken(req))
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }

    return res.status(200).json(
      followed.map<FollowedStudentPayload>(f => ({
        name: f.name,
        email: f.email,
        university: f.university
      }))
    )
  })
}

function followStudentByEmail(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.post('/follow', [check('email').isEmail()], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })
    const { email } = req.body

    const [me, errMe] = await restServer.getStudentService().getStudentById(getIdFromDecodedToken(req))
    if (errMe !== null) {
      return res.status(403).json({ error: errMe.message })
    }

    if (me.email === email) {
      return res.status(400).json({ error: 'cannot follow yourself' })
    }

    const [toFollow, err] = await restServer.getStudentService().getStudentByEmail(email)
    if (err !== null) {
      return res.status(401).json({ error: err.message })
    }

    const err2 = await restServer.getStudentService().followStudent(getIdFromDecodedToken(req), toFollow.id)
    if (err2 !== null) {
      return res.status(400).json({ error: err2.message })
    }

    return res.status(200).json({ status: 'OK' })
  })
}

function unfollowStudentByEmail(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.post('/unfollow', [check('email').isEmail()], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })
    const { email } = req.body

    const [me, errMe] = await restServer.getStudentService().getStudentById(getIdFromDecodedToken(req))
    if (errMe !== null) {
      return res.status(403).json({ error: errMe.message })
    }

    if (me.email === email) {
      return res.status(400).json({ error: 'cannot follow yourself' })
    }

    const [toFollow, err] = await restServer.getStudentService().getStudentByEmail(email)
    if (err !== null) {
      return res.status(401).json({ error: err.message })
    }

    const err2 = await restServer.getStudentService().unfollowStudent(getIdFromDecodedToken(req), toFollow.id)
    if (err2 !== null) {
      return res.status(400).json({ error: err2.message })
    }

    return res.status(200).json({ status: 'OK' })
  })
}
function getFeedPosts(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/feed', async (req: Request, res: Response) => {
    const [followed, err] = await restServer.getStudentService().getFollowed(getIdFromDecodedToken(req))
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }

    const now2WeeksAgo = Date.now() - 1000 * 60 * 60 * 24 * 7 * 2

    const allPostsFromLast2Weeks: PostPayload[] = []
    for (const followedStudent of followed) {
      const [pages, errPages] = await restServer.getStudentService().getPagesOfStudent(followedStudent.id)
      if (errPages !== null) {
        return res.status(400).json({ error: errPages.message })
      }
      for (const page of pages) {
        const [posts, errPosts] = await restServer.getStudentService().getPostsOfPage(followedStudent.id, page.title)
        if (errPosts !== null) {
          return res.status(400).json({ error: errPosts.message })
        }
        const filteredPosts = posts.filter(post => post.dateCreated.getTime() >= now2WeeksAgo)
        allPostsFromLast2Weeks.push(
          ...filteredPosts.map<PostPayload>(p => ({
            ...p,
            ownerName: followedStudent.name,
            pageTitle: page.title,
            title: p.title
          }))
        )
      }
    }

    return res.status(200).json(allPostsFromLast2Weeks)
  })
}

function getPosts(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.get('/posts/:pageTitle', async (req: Request, res: Response) => {
    const pageTitle = req.params.pageTitle
    if (pageTitle === null || pageTitle.length < 3) {
      return res.status(400).json({ error: 'page title missing or too short' })
    }

    const studentID = getIdFromDecodedToken(req)
    const [student, errStu] = await restServer.getStudentService().getStudentById(studentID)
    if (errStu !== null) {
      return res.status(400).json({ error: errStu.message })
    }

    const [pages, errPage] = await restServer.getStudentService().getPagesOfStudent(studentID)
    if (errPage !== null) {
      return res.status(400).json({ error: errPage.message })
    }
    if (pages.findIndex(p => p.title === pageTitle) === -1) {
      return res.status(400).json({ error: 'page not found' })
    }

    const [posts, err] = await restServer.getStudentService().getPostsOfPage(studentID, pageTitle)
    if (err !== null) {
      return res.status(400).json({ error: err.message })
    }

    return res.status(200).json(
      posts.map<PostPayload>(p => {
        return { pageTitle, ...p, ownerName: student.name }
      })
    )
  })
}

function addPost(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.post(
    '/posts/new/:pageTitle',
    [check('title').isLength({ min: 3, max: 150 }), check('content').isLength({ min: 3, max: 300 })],
    async (req: Request, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })
      const { title, content } = req.body
      const pageTitle = req.params.pageTitle
      if (pageTitle === null || pageTitle.length < 3) {
        return res.status(400).json({ error: 'page title missing or too short' })
      }

      const studentID = getIdFromDecodedToken(req)
      const [pages, errPage] = await restServer.getStudentService().getPagesOfStudent(studentID)
      if (errPage !== null) {
        return res.status(400).json({ error: errPage.message })
      }
      if (pages.findIndex(p => p.title === pageTitle) === -1) {
        return res.status(400).json({ error: 'page not found' })
      }

      const post: Post = { title, content, dateCreated: new Date() }
      const err = await restServer.getStudentService().addPostToStudent(studentID, pageTitle, post)
      if (err !== null) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({ status: 'OK' })
    }
  )
}

function likePost(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.post(
    '/posts/like',
    [
      check('postOwnerAddress').isEmail(),
      check('pageTitle').isLength({ min: 3 }),
      check('postTitle').isLength({ min: 3 })
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })

      const { pageTitle, postTitle, postOwnerAddress } = req.body

      const studentID = getIdFromDecodedToken(req)

      const [postOwner, errOwner] = await restServer.getStudentService().getStudentByEmail(postOwnerAddress)
      if (errOwner !== null) {
        return res.status(401).json({ error: errOwner.message })
      }

      const [pages, errPage] = await restServer.getStudentService().getPagesOfStudent(postOwner.id)
      if (errPage !== null) {
        return res.status(400).json({ error: errPage.message })
      }
      const pageIndex = pages.findIndex(p => p.title === pageTitle)
      if (pageIndex === -1) {
        return res.status(400).json({ error: 'page not found' })
      }

      const [posts, errPosts] = await restServer.getStudentService().getPostsOfPage(studentID, pages[pageIndex].title)
      if (errPosts !== null) {
        return res.status(400).json({ error: errPosts.message })
      }
      const postExists = posts.findIndex(p => p.title === postTitle) === -1
      if (postExists) {
        return res.status(400).json({ error: 'post not found' })
      }

      const err = await restServer.getStudentService().likePost(studentID, postOwner.id, pageTitle, postTitle)
      if (err !== null) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({ status: 'OK' })
    }
  )
}

function unlikePost(restServer: RestWebServer, apiRouter: express.Router): void {
  apiRouter.post(
    '/posts/unlike',
    [
      check('postOwnerAddress').isEmail(),
      check('pageTitle').isLength({ min: 3 }),
      check('postTitle').isLength({ min: 3 })
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid data' })

      const { pageTitle, postTitle, postOwnerAddress } = req.body

      const studentID = getIdFromDecodedToken(req)

      const [postOwner, errOwner] = await restServer.getStudentService().getStudentByEmail(postOwnerAddress)
      if (errOwner !== null) {
        return res.status(401).json({ error: errOwner.message })
      }

      const [pages, errPage] = await restServer.getStudentService().getPagesOfStudent(postOwner.id)
      if (errPage !== null) {
        return res.status(400).json({ error: errPage.message })
      }
      const pageIndex = pages.findIndex(p => p.title === pageTitle)
      if (pageIndex === -1) {
        return res.status(400).json({ error: 'page not found' })
      }

      const [posts, errPosts] = await restServer.getStudentService().getPostsOfPage(studentID, pages[pageIndex].title)
      if (errPosts !== null) {
        return res.status(400).json({ error: errPosts.message })
      }
      const postExists = posts.findIndex(p => p.title === postTitle) === -1
      if (postExists) {
        return res.status(400).json({ error: 'post not found' })
      }

      const err = await restServer.getStudentService().unlikePost(studentID, postOwner.id, pageTitle, postTitle)
      if (err !== null) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({ status: 'OK' })
    }
  )
}

function getIdFromDecodedToken(req: Request): number {
  return (req.user as any)?.sub?.id ?? -1
}
