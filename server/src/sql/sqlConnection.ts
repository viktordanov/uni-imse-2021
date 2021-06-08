import mysql from 'mysql'

const sqlConfig = {
  host: 'mariadb',
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: 'imse',
  multipleStatements: true
}

const db = mysql.createConnection(sqlConfig)

const pool = mysql.createPool(sqlConfig)

function executeQuery(
  query: string,
  params: any[],
  connection: mysql.Pool | mysql.Connection = pool
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        console.log('sql error for query ', query, ' with params ', params, ': ', err.message)
        return reject(err.message)
      }
    })
    return resolve(true)
  })
}

function executeScalarType<T>(
  query: string,
  params: any[],
  connection: mysql.Pool | mysql.Connection = pool
): Promise<T> {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        console.log('sql error: ', err.message)
        return reject(err.message)
      } else if (result) {
        return resolve(Object.assign({}, result[0]) as T)
      }
    })
  })
}

function executeQueryType<T>(
  query: string,
  params: any[],
  connection: mysql.Pool | mysql.Connection = pool
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        console.log('sql error: ', err.message)
        return reject(err.message)
      } else if (result) {
        const list: T[] = []
        result.forEach((element: T) => {
          list.push(Object.assign({}, element) as T)
        })
        return resolve(list)
      }
    })
  })
}

export const SQLConnection = {
  pool,
  executeQuery,
  executeScalarType,
  executeQueryType
}
