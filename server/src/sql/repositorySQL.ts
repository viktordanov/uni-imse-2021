import {
  Account,
  Admin,
  Event,
  Page,
  Post,
  ReportFamousStudents,
  ReportStudentActivity,
  Student
} from '../entities/entities'
import { Repository } from '../entities/repository'
import { SQLConnection } from '../sql/sqlConnection'
import { SQLQueries as queries } from './sqlQueries'

export class RepositorySQL implements Repository {
  private sqlConnection: SQLConnection

  constructor() {
    this.sqlConnection = new SQLConnection()
  }

  getAccountByEmail(email: string): Promise<[Account, boolean]> {
    return this.sqlConnection.executeScalarType<Account>(queries.getAccountByEmail, [email])
  }

  addPage(studentId: number, page: Page): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.addPage, [studentId, page.title, page.description, page.dateCreated])
  }

  removePage(studentId: number, title: string): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removePage, [studentId, title])
  }

  getPageByTitle(studentId: number, title: string): Promise<[Page, boolean]> {
    return this.sqlConnection.executeScalarType<Page>(queries.getPageByTitle, [studentId, title])
  }

  updatePage(studentId: number, page: Page): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.updatePage, [
      page.title,
      page.description,
      page.dateCreated,
      studentId,
      page.title
    ])
  }

  addPost(studentId: number, pageTitle: string, post: Post): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.addPost, [
      studentId,
      pageTitle,
      post.title,
      post.content,
      post.dateCreated
    ])
  }

  removePost(studentId: number, pageTitle: string, title: string): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removePost, [studentId, pageTitle, title])
  }

  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<[Post, boolean]> {
    return this.sqlConnection.executeScalarType<Post>(queries.getPostByTitle, [studentId, pageTitle, title])
  }

  updatePost(studentId: number, pageTitle: string, post: Post): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.updatePost, [
      post.content,
      post.dateCreated,
      studentId,
      pageTitle,
      post.title
    ])
  }

  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<[Student[], boolean]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getStudentLikesOfPost, [
      studentId,
      pageTitle,
      postTitle
    ])
  }

  addStudent(s: Student): Promise<boolean> {
    return new Promise(resolve => {
      this.sqlConnection.getPool().getConnection((err, con) => {
        if (err) console.log('sql error: ', err.message)
        this.sqlConnection
          .executeQuery(queries.addAccount, [s.name, s.email, s.passwordHash, s.dateRegistered], con)
          .then(() => {
            this.sqlConnection
              .executeQuery(queries.addStudentIDLastInserted, [s.university, s.matNumber], con)
              .then(() => {
                this.sqlConnection
                  .executeScalarType<{ id: number }>(queries.selectLastInsertID, [], con)
                  .then((element: [{ id: number }, boolean]) => {
                    s.id = element[0].id
                    resolve(true)
                    con.release()
                  })
              })
          })
      })
    })
  }

  removeStudent(id: number): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removeStudent, [id])
  }

  getStudentById(id: number): Promise<[Student, boolean]> {
    return this.sqlConnection.executeScalarType<Student>(queries.getStudentById, [id])
  }

  updateStudent(s: Student): Promise<boolean> {
    return new Promise(resolve => {
      this.sqlConnection
        .executeQuery(queries.updateStudent, [s.university, s.matNumber, s.id])
        .then((success: boolean) => {
          if (success)
            this.sqlConnection
              .executeQuery(queries.updateAccount, [s.name, s.email, s.passwordHash, s.dateRegistered, s.id])
              .then(() => {
                resolve(true)
              })
        })
    })
  }

  getAllStudents(): Promise<[Student[], boolean]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getAllStudents, [])
  }

  getFollowersOf(id: number): Promise<[Student[], boolean]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getFollowersOf, [id])
  }

  getFollowing(id: number): Promise<[Student[], boolean]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getFollowing, [id])
  }

  addFollow(who: number, followsWhom: number): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.addFollow, [who, followsWhom])
  }

  removeFollow(who: number, followsWhom: number): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removeFollow, [who, followsWhom])
  }

  getLikedPostsOf(id: number): Promise<[Post[], boolean]> {
    return this.sqlConnection.executeQueryType<Post>(queries.getLikedPostsOf, [id])
  }

  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.addLike, [who, whosePost, pageTitle, postTitle])
  }

  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removeLike, [who, whosePost, pageTitle, postTitle])
  }

  addAdmin(s: Admin): Promise<boolean> {
    return new Promise(resolve => {
      this.sqlConnection.getPool().getConnection((err, con) => {
        if (err) console.log('sql error: ', err.message)
        this.sqlConnection
          .executeQuery(queries.addAccount, [s.name, s.email, s.passwordHash, s.dateRegistered], con)
          .then(() => {
            this.sqlConnection.executeQuery(queries.addAdmin, [s.id, s.address, s.ssn], con).then(() => {
              return this.sqlConnection
                .executeScalarType<{ id: number }>(queries.selectLastInsertID, [], con)
                .then((element: [{ id: number }, boolean]) => {
                  s.id = element[0].id
                  resolve(true)
                  con.release()
                })
            })
          })
      })
    })
  }

  removeAdmin(id: number): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removeAdmin, [id])
  }

  getAdminById(id: number): Promise<[Admin, boolean]> {
    return this.sqlConnection.executeScalarType<Admin>(queries.getAdminById, [id])
  }

  updateAdmin(s: Admin): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.updateAdmin, [s.address, s.ssn, s.id])
  }

  getAllAdmins(): Promise<[Admin[], boolean]> {
    return this.sqlConnection.executeQueryType<Admin>(queries.getAllAdmins, [])
  }

  addEvent(e: Event): Promise<boolean> {
    return new Promise(resolve => {
      this.sqlConnection.getPool().getConnection((err, con) => {
        if (err) console.log('sql error: ', err.message)
        this.sqlConnection.executeQuery(queries.addEvent, [e.name, e.description, e.duration, e.date], con).then(() => {
          this.sqlConnection
            .executeScalarType<{ id: number }>(queries.selectLastInsertID, [], con)
            .then((element: [{ id: number }, boolean]) => {
              e.id = element[0].id
              resolve(true)
              con.release()
            })
        })
      })
    })
  }

  removeEvent(id: number): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.removeEvent, [id])
  }

  getEventById(id: number): Promise<[Event, boolean]> {
    return this.sqlConnection.executeScalarType<Event>(queries.getEventById, [id])
  }

  getEventByName(name: string): Promise<[Event, boolean]> {
    return this.sqlConnection.executeScalarType<Event>(queries.getEventByName, [name])
  }

  updateEvent(e: Event): Promise<boolean> {
    return this.sqlConnection.executeQuery(queries.updateEvent, [e.id])
  }

  getAllEvents(): Promise<[Event[], boolean]> {
    return this.sqlConnection.executeQueryType<Event>(queries.getAllEvents, [])
  }

  getAllPagesOf(studentId: number): Promise<[Page[], boolean]> {
    return this.sqlConnection.executeQueryType<Page>(queries.getAllPagesOf, [studentId])
  }

  getAllPostsOf(studentId: number, pageTitle: string): Promise<[Post[], boolean]> {
    return this.sqlConnection.executeQueryType<Post>(queries.getAllPostsOf, [studentId, pageTitle])
  }

  getAllEventsCreatedBy(adminId: number): Promise<[Event[], boolean]> {
    return this.sqlConnection.executeQueryType<Event>(queries.getAllEventsCreatedBy, [adminId])
  }

  getReportStudentActivity(weeks: number): Promise<[ReportStudentActivity[], boolean]> {
    return this.sqlConnection.executeQueryType<ReportStudentActivity>(queries.getReportStudentActivity, [weeks])
  }

  getReportFamousStudents(searchPostTitle: string): Promise<[ReportFamousStudents[], boolean]> {
    return this.sqlConnection.executeQueryType<ReportFamousStudents>(queries.getReportFamousStudents, [searchPostTitle])
  }
}
