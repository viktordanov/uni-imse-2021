import { Page, Post, Student } from '../entities/entities'
import { Repository } from '../entities/repository'
import { SQLConnection } from '../sql/sqlConnection'
import { SQLQueries } from '../sql/sqlQueries'
import { getPage, getPost, getStudents } from './mockData'

async function insertData(repository: Repository): Promise<void> {
  const students = await repository.getAllStudents()
  if (students[1] || students[0].length !== 0) {
    return
  }
  getStudents().then(students => {
    getPage().then(pages => {
      getPost().then(posts => {
        const promises: Promise<boolean | void>[] = []
        students.forEach(student => {
          promises.push(
            repository.addStudent(student).then(() => {
              const shuffledPages = pages.sort((a, b) => 0.5 - Math.random())
              for (let i = 0; i < randomNumber(1, 4); i++) {
                promises.push(
                  repository.addPage(student.id, shuffledPages[i]).then(() => {
                    const shufflePosts = posts.sort((a, b) => 0.5 - Math.random())
                    for (let i = 0; i < randomNumber(1, 4); i++) {
                      repository.addRandomPost(shufflePosts[i])
                    }
                  })
                )
              }
            })
          )
        })
        Promise.all(promises).then(() => {
          for (let i = 0; i < randomNumber(5, 10); i++) {
            repository.addRandomFollows()
            repository.addRandomLikes()
          }
        })
      })
    })
  })
  const student: Student = {
    id: 0,
    name: 'Raph Lach',
    email: 'test@gmail.com',
    passwordHash: '$2b$10$zKqP3TmC6EClVL9rGj17..40giJdDuW71sUCsXrVJ4vMZtbEcXC4m',
    dateRegistered: new Date(),
    accountType: 'student',
    university: 'University of Vienna',
    matNumber: '12345678'
  }
  repository.addStudent(student)
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min
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
