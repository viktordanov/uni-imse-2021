import { getStudents, getPage, getPost } from './mockData'
import { SQLConnection } from '../sql/sqlConnection'
import { Page, Post, Student } from '../entities/entities'
import { SQLQueries } from '../sql/sqlQueries'

function insertData(): void {
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
    SQLConnection.executeQuery(SQLQueries.addAccount, [
      student.name,
      student.email,
      student.passwordHash,
      student.dateRegistered
    ])
      .then(() => {
        SQLConnection.executeQuery(SQLQueries.addStudentIDLastInserted, [student.university, student.dateRegistered])
      })
      .then(() => {
        SQLConnection.executeQuery(SQLQueries.addRandomIsFriendsWith, [])
      })
  })
}

function insertPages(pages: Page[]) {
  pages.forEach(page => {
    SQLConnection.executeQuery(SQLQueries.addRandomPage, [page.title, page.description, page.dateCreated])
  })
}

function insertPost(posts: Post[]) {
  posts.forEach(post => {
    SQLConnection.executeQuery(SQLQueries.addRandomPost, [post.title, post.content, post.dateCreated])
  })
}

export const SQLFilling = { insertData }
