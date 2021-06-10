import { Page, Post, Student } from '../entities/entities'
import { SQLConnection } from '../sql/sqlConnection'
import { SQLQueries } from '../sql/sqlQueries'

// function insertData(): void {
//   getStudents().then(students => {
//     console.log(students)
//     insertStudents(students)

//     getPage().then(pages => {
//       insertPages(pages)

//       getPost().then(post => {
//         insertPost(post)
//       })
//     })
//   })
// }

function insertStudents(sqlConnection: SQLConnection, students: Student[]) {
  students.forEach(student => {
    console.log('student: ', student)
    sqlConnection
      .executeQuery(SQLQueries.addAccount, [student.name, student.email, student.passwordHash, student.dateRegistered])
      .then(() => {
        sqlConnection.executeQuery(SQLQueries.addStudentIDLastInserted, [student.university, student.dateRegistered])
      })
      .then(() => {
        sqlConnection.executeQuery(SQLQueries.addRandomIsFriendsWith, [])
      })
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

// export const SQLFilling = { insertData }
