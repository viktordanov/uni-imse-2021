import { Page, Post, Student } from '../entities/entities'
import { Repository } from '../entities/repository'
import { SQLConnection } from '../sql/sqlConnection'
import { SQLQueries } from '../sql/sqlQueries'
import { getPage, getPost, getStudents } from './mockData'

function insertData(repository: Repository): void {
  getStudents().then(students => {
    console.log(students)
    getPage().then(pages => {
      getPost().then(posts => {
        students.forEach(student => {
          repository.addStudent(student).then(() => {
            pages.forEach(page => {
              repository.addPage(student.id, page).then(() => {
                posts.forEach(post => {
                  repository.addPost(student.id, page.title, post)
                })
              })
            })
          })
        })
      })
    })
  })
}

function insertStudents(repository: Repository, students: Student[]) {
  students.forEach(student => {
    console.log('student: ', student)
    repository.addStudent(student)
    /* sqlConnection
      .executeQuery(SQLQueries.addAccount, [student.name, student.email, student.passwordHash, student.dateRegistered])
      .then(() => {
        sqlConnection.executeQuery(SQLQueries.addStudentIDLastInserted, [student.university, student.dateRegistered])
      })
      .then(() => {
        sqlConnection.executeQuery(SQLQueries.addRandomIsFriendsWith, [])
      }) */
  })
}

function insertPages(sqlConnection: SQLConnection, pages: Page[]) {
  pages.forEach(page => {
    sqlConnection.executeQuery(SQLQueries.addRandomPage, [page.title, page.description, page.dateCreated])
  })
}

function insertPost(sqlConnection: SQLConnection, posts: Post[]) {
  posts.forEach(post => {
    sqlConnection.executeQuery(SQLQueries.addRandomPost, [post.title, post.content, post.dateCreated])
  })
}

export const SQLFilling = { insertData }
