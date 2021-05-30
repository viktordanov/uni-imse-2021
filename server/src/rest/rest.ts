import express from 'express'
import compression from 'compression'

export type RestConfig = {
  host: string
  port: string
  staticDir: string
}

export interface Rest {
  config: RestConfig
}

export class RestWebServer implements Rest {
  config: RestConfig
  private webServer: express.Express

  constructor(config: RestConfig) {
    this.config = config
    this.webServer = express()

    this.webServer.get('/', (req, res) => {
      res.send('Hello World!')
    })

    this.webServer.use(compression())
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
