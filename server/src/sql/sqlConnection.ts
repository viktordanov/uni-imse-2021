import mysql from 'mysql'
import { Admin, Page, Post, Student, Event } from '../entities/entities'

const db = mysql.createConnection({
  host: 'mariadb',
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: 'imse',
  multipleStatements: true
})

function executeQuery(query: string, params: any[]): boolean {
  db.query(query, params, (err, result) => {
    if (err) {
      console.log('sql error for query ', query, ' with params ', params, ': ', err.message)
      return false
    }
  })
  return true
}

function executeScalarType<T>(query: string, params: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        console.log('sql error: ', err.message)
        return reject(err.message)
      } else if (result) {
        return resolve(Object.assign({}, result[0]) as T)
      }
    })
  })
}

function executeQueryType<T>(query: string, params: any[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
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

const addAccount = 'insert into Account (Name, Email, Password_hash, Date_registered) values (?, ?, ?, ?);'

const addStudent = 'insert into Student (StudentID, University, Matriculation_number) values (last_insert_id(), ?, ?);'

const addRandomPage =
  'insert into Page (StudentID, Title, Description, Date_created) values ((select StudentID from Student order by rand() limit 1), ?, ?, ?);'

const addRandomPost =
  'set @studentID = (select StudentID from Page order by rand() limit 1); ' +
  'insert into Post (StudentID, Page_Title, Title, Content, Date_created) values (@studentID, (select Title from Page where StudentID = @studentID order by rand() limit 1), ?, ?, ?);'

const addRandomIsFriendsWith =
  'set @studentID = (select StudentID from Page order by rand() limit 1); ' +
  'insert into follows (StudentID, Friend_StudentID) values (@studentID, (select StudentID from Student where StudentID != @studentID order by rand() limit 1));'

export const SQLConnection = {
  db,
  addAccount,
  addStudent,
  addRandomPage,
  addRandomPost,
  addRandomIsFriendsWith,
  executeQuery,
  executeScalarType,
  executeQueryType
}
