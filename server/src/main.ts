import { RestConfig, RestWebServer } from './rest/rest'
import { AuthService } from './service/authService'
import { EventsService } from './service/eventsService'
import { StudentContentService } from './service/studentContentService'
import { RepositorySQL } from './sql/repositorySQL'

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
  const sqlRepository = new RepositorySQL()

  const authService = new AuthService(sqlRepository, JWT_SECRET)

  const webServer = new RestWebServer(restConfig, authService, {} as EventsService, {} as StudentContentService)
  webServer.serve()
}

main()
