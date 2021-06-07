import { getStudents, getPage, getPost } from './mockData'
import { db, addAccount, addStudent, addRandomPage, addRandomPost, addRandomIsFriendsWith } from '../sql/sqlConnection'
import { Page, Post, Student } from '../entities/entities'

function insertData() {
  getStudents().then(students => {
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
    db.query(addAccount, [student.name, student.email, student.passwordHash, student.dateRegistered], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
    db.query(addStudent, [student.university, student.dateRegistered], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })

  students.forEach(() => {
    db.query(addRandomIsFriendsWith, [], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}

function insertPages(pages: Page[]) {
  pages.forEach(page => {
    db.query(addRandomPage, [page.title, page.description, page.dateCreated], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}

function insertPost(posts: Post[]) {
  posts.forEach(post => {
    db.query(addRandomPost, [post.title, post.content, post.dateCreated], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}

export const SQLFilling = { insertData }
