import mysql, { PoolConfig } from 'mysql'
const sqlConfig: PoolConfig = {
  host: 'mariadb',
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: 'imse',
  multipleStatements: true,
  connectionLimit: 15,
  queueLimit: 30,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000
}
export class SQLConnection {
  private pool: mysql.Pool

  getPool(): mysql.Pool {
    return this.pool
  }

  constructor() {
    this.pool = mysql.createPool(sqlConfig)
  }

  executeQuery(query: string, params: any[], connection: mysql.Pool | mysql.Connection = this.pool): Promise<boolean> {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.log('sql error for query ', query, ' with params ', params, ': ', err.message)
          return resolve(false)
        }
        return resolve(true)
      })
    })
  }

  executeScalarType<T>(
    query: string,
    params: any[],
    connection: mysql.Pool | mysql.Connection = this.pool
  ): Promise<[T, boolean]> {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.log('sql error: ', err.message)
          return resolve([undefined, false])
        } else if (result) {
          return resolve([Object.assign({}, result[0]) as T, true])
        } else {
          return resolve([undefined, false])
        }
      })
    })
  }

  executeQueryType<T>(
    query: string,
    params: any[],
    connection: mysql.Pool | mysql.Connection = this.pool
  ): Promise<[T[], boolean]> {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.log('sql error: ', err.message)
          return resolve([undefined, false])
        } else if (result) {
          const list: T[] = []
          result.forEach((element: T) => {
            list.push(Object.assign({}, element) as T)
          })
          return resolve([list, true])
        } else {
          return resolve([undefined, false])
        }
      })
    })
  }
}
