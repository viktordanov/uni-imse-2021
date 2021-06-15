import { Admin } from './entities/entities'
import { MongoRepository } from './mongodb/mongoRepo'
import { RestConfig, RestWebServer } from './rest/rest'
import { AuthService } from './service/authService'
import { StudentContentService } from './service/studentContentService'
import { RepositorySQL } from './sql/repositorySQL'
import { SQLFilling } from './sqlFilling/dbFillingSQL'

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
  // const repo = new RepositorySQL()
  const repo = new MongoRepository()

  await repo.initialize()

  const authService = new AuthService(repo, JWT_SECRET)
  const studentService = new StudentContentService(repo)

  const err = await authService.adminSignup(
    'Admin Account',
    'admin@annorum.me',
    'adminpassword',
    'Infinite Loop Rd. 0',
    8901823723432
  )
  SQLFilling.insertData(repo)

  const webServer = new RestWebServer(restConfig, authService, studentService)
  webServer.serve()
}

main()
