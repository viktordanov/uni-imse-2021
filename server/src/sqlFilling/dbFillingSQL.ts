import { getStudents, getPage, getPost } from './mockData'
import { SQLConnection } from '../sql/sqlConnection'
import { Page, Post, Student } from '../entities/entities'

function insertData() {
  getStudents().then(students => {
    console.log(students)
    insertStudents(students)

    getPage().then(pages => {
      insertPages(pages)

      getPost().then(post => {
        insertPost(post)
      })
    })
  })
}

function insertStudents(students: Student[]) {
  students.forEach(student => {
    console.log('student: ', student)
    SQLConnection.db.query(
      SQLConnection.addAccount,
      [student.name, student.email, student.passwordHash, student.dateRegistered],
      (err, result) => {
        if (err) {
          console.log('sql error', err.message)
        }
      }
    )
    SQLConnection.db.query(SQLConnection.addStudent, [student.university, student.dateRegistered], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })

  students.forEach(() => {
    SQLConnection.db.query(SQLConnection.addRandomIsFriendsWith, [], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}

function insertPages(pages: Page[]) {
  pages.forEach(page => {
    SQLConnection.db.query(
      SQLConnection.addRandomPage,
      [page.title, page.description, page.dateCreated],
      (err, result) => {
        if (err) {
          console.log('sql error', err.message)
        }
      }
    )
  })
}

function insertPost(posts: Post[]) {
  posts.forEach(post => {
    SQLConnection.db.query(SQLConnection.addRandomPost, [post.title, post.content, post.dateCreated], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}

export const SQLFilling = { insertData }
