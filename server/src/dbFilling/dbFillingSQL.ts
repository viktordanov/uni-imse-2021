import { Student, getStudents, getPage, getPost, Page, Post } from './mockData'
import { db, addAccount, addStudent, addRandomPage, addRandomPost, addRandomIsFriendsWith } from '../sqlConnection'

export function insertData() {
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
    db.query(
      addAccount,
      [student.firstname + ' ' + student.lastname, student.email, student.passwordhash, student.dateregistered],
      (err, result) => {
        if (err) {
          console.log('sql error', err.message)
        }
      }
    )
    db.query(addStudent, [student.university, student.dateregistered], (err, result) => {
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
    db.query(addRandomPage, [page.title, page.description, page.datecreated], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}

function insertPost(posts: Post[]) {
  posts.forEach(post => {
    db.query(addRandomPost, [post.title, post.content, post.datecreated], (err, result) => {
      if (err) {
        console.log('sql error', err.message)
      }
    })
  })
}
