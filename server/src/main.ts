import { MongoRepository } from './mongodb/mongoRepo'
import { RestConfig, RestWebServer } from './rest/rest'
import { AuthService } from './service/authService'
import { StudentContentService } from './service/studentContentService'

async function main() {
  const HOST = process.env.HOST ?? 'locahost'
  const PORT = process.env.PORT ?? '8080'
  const STATIC_DIR = process.env.STATIC_DIR ?? 'static'
  const JWT_SECRET = process.env.JWT_SECRET ?? 'DEBUG'
  const restConfig: RestConfig = {
    host: HOST,
    port: PORT,
    staticDir: STATIC_DIR,
    jwtSecret: JWT_SECRET
  }
  // const sqlRepository = new RepositorySQL()
  const mongoRepo = new MongoRepository()

  await mongoRepo.initialize()

  const authService = new AuthService(mongoRepo, JWT_SECRET)
  const studentService = new StudentContentService(mongoRepo)

  const webServer = new RestWebServer(restConfig, authService, studentService)
  webServer.serve()
}

main()
