import os from 'os'
import { RestConfig, RestWebServer } from './rest/rest'

function main() {
  const HOST = process.env.HOST ?? 'locahost'
  const PORT = process.env.HOST ?? '8080'
  const STATIC_DIR = process.env.HOST ?? 'static'

  const restConfig: RestConfig = { host: HOST, port: PORT, staticDir: STATIC_DIR }

  const webServer = new RestWebServer(restConfig)
  webServer.serve()
}

main()
