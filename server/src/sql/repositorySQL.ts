import { Account, Admin, Event, Page, Post, Student } from '../entities/entities'
import { Repository } from '../entities/repository'
import { SQLConnection } from '../sql/sqlConnection'
import { SQLQueries as queries } from './sqlQueries'

export class RepositorySQL implements Repository {
  private sqlConnection: SQLConnection

  constructor() {
    this.sqlConnection = new SQLConnection()
    this.sqlConnection.getPool().on('release', function (connection) {
      console.log('Connection %d released', connection.threadId)
    })
  }

  getAccountByEmail(email: string): Promise<Account> {
    console.log(this.sqlConnection)

    return this.sqlConnection.executeScalarType<Account>(queries.getAccountByEmail, [email])
  }

  addPage(studentId: number, page: Page): void {
    this.sqlConnection.executeQuery(queries.addPage, [studentId, page.title, page.description, page.dateCreated])
  }

  removePage(studentId: number, title: string): void {
    this.sqlConnection.executeQuery(queries.removePage, [studentId, title])
  }

  getPageByTitle(studentId: number, title: string): Promise<Page> {
    return this.sqlConnection.executeScalarType<Page>(queries.getPageByTitle, [studentId, title])
  }

  updatePage(studentId: number, page: Page): void {
    this.sqlConnection.executeQuery(queries.updatePage, [
      page.title,
      page.description,
      page.dateCreated,
      studentId,
      page.title
    ])
  }

  addPost(studentId: number, pageTitle: string, post: Post): void {
    this.sqlConnection.executeQuery(queries.addPost, [studentId, pageTitle, post.title, post.content, post.dateCreated])
  }

  removePost(studentId: number, pageTitle: string, title: string): void {
    this.sqlConnection.executeQuery(queries.removePost, [studentId, pageTitle, title])
  }

  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<Post> {
    return this.sqlConnection.executeScalarType<Post>(queries.getPostByTitle, [studentId, pageTitle, title])
  }

  updatePost(studentId: number, pageTitle: string, post: Post): void {
    this.sqlConnection.executeQuery(queries.updatePost, [
      post.content,
      post.dateCreated,
      studentId,
      pageTitle,
      post.title
    ])
  }

  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<Student[]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getStudentLikesOfPost, [
      studentId,
      pageTitle,
      postTitle
    ])
  }

  addStudent(s: Student): void {
    this.sqlConnection.getPool().getConnection((err, con) => {
      if (err) console.log('sql error: ', err.message)
      this.sqlConnection
        .executeQuery(queries.addAccount, [s.name, s.email, s.passwordHash, s.dateRegistered], con)
        .then(() => {
          this.sqlConnection
            .executeQuery(queries.addStudentIDLastInserted, [s.university, s.matNumber], con)
            .then(() => {
              this.sqlConnection.executeScalarType(queries.selectLastInsertID, [], con).then((element: number) => {
                s.id = element
                con.release()
              })
            })
        })
    })
  }

  removeStudent(id: number): void {
    this.sqlConnection.executeQuery(queries.removeStudent, [id])
  }

  getStudentById(id: number): Promise<Student> {
    return this.sqlConnection.executeScalarType<Student>(queries.getStudentById, [id])
  }

  updateStudent(s: Student): void {
    this.sqlConnection.executeQuery(queries.updateStudent, [s.university, s.matNumber, s.id])
    this.sqlConnection.executeQuery(queries.updateAccount, [s.name, s.email, s.passwordHash, s.dateRegistered, s.id])
  }

  getAllStudents(): Promise<Student[]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getStudentLikesOfPost, [])
  }

  getFollowersOf(id: number): Promise<Student[]> {
    return this.sqlConnection.executeQueryType<Student>(queries.getFollowersOf, [id])
  }

  addFollow(who: number, followsWhom: number): void {
    this.sqlConnection.executeQuery(queries.addFollow, [who, followsWhom])
  }

  removeFollow(who: number, followsWhom: number): void {
    this.sqlConnection.executeQuery(queries.removeFollow, [who, followsWhom])
  }

  getLikedPostsOf(id: number): Promise<Post[]> {
    return this.sqlConnection.executeQueryType<Post>(queries.getLikedPostsOf, [id])
  }

  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void {
    this.sqlConnection.executeQuery(queries.addLike, [who, whosePost, pageTitle, postTitle])
  }

  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void {
    this.sqlConnection.executeQuery(queries.removeLike, [who, whosePost, pageTitle, postTitle])
  }

  addAdmin(s: Admin): void {
    this.sqlConnection.getPool().getConnection((err, con) => {
      if (err) console.log('sql error: ', err.message)
      this.sqlConnection
        .executeQuery(queries.addAccount, [s.name, s.email, s.passwordHash, s.dateRegistered], con)
        .then(() => {
          this.sqlConnection.executeQuery(queries.addAdmin, [s.id, s.address, s.ssn], con).then(() => {
            this.sqlConnection.executeScalarType(queries.selectLastInsertID, [], con).then((element: number) => {
              s.id = element
              con.release()
            })
          })
        })
    })
  }

  removeAdmin(id: number): void {
    this.sqlConnection.executeQuery(queries.removeAdmin, [id])
  }

  getAdminById(id: number): Promise<Admin> {
    return this.sqlConnection.executeScalarType<Admin>(queries.getAdminById, [id])
  }

  updateAdmin(s: Admin): void {
    this.sqlConnection.executeQuery(queries.updateAdmin, [s.address, s.ssn, s.id])
  }

  getAllAdmins(): Promise<Admin[]> {
    return this.sqlConnection.executeQueryType<Admin>(queries.getAllAdmins, [])
  }

  addEvent(e: Event): void {
    this.sqlConnection.getPool().getConnection((err, con) => {
      if (err) console.log('sql error: ', err.message)
      this.sqlConnection.executeQuery(queries.addEvent, [e.name, e.description, e.duration, e.date], con).then(() => {
        this.sqlConnection.executeScalarType(queries.selectLastInsertID, [], con).then((element: number) => {
          e.id = element
          con.release()
        })
      })
    })
  }

  removeEvent(id: number): void {
    this.sqlConnection.executeQuery(queries.removeEvent, [id])
  }

  getEventById(id: number): Promise<Event> {
    return this.sqlConnection.executeScalarType<Event>(queries.getEventById, [id])
  }

  getEventByName(name: string): Promise<Event> {
    return this.sqlConnection.executeScalarType<Event>(queries.getEventByName, [name])
  }

  updateEvent(e: Event): void {
    this.sqlConnection.executeQuery(queries.updateEvent, [e.id])
  }

  getAllEvents(): Promise<Event[]> {
    return this.sqlConnection.executeQueryType<Event>(queries.getAllEvents, [])
  }

  getAllPagesOf(studentId: number): Promise<Page[]> {
    return this.sqlConnection.executeQueryType<Page>(queries.getAllPagesOf, [studentId])
  }

  getAllPostsOf(studentId: number, pageTitle: string): Promise<Post[]> {
    return this.sqlConnection.executeQueryType<Post>(queries.getAllPostsOf, [studentId, pageTitle])
  }

  getAllEventsCreatedBy(adminId: number): Promise<Event[]> {
    return this.sqlConnection.executeQueryType<Event>(queries.getAllEventsCreatedBy, [adminId])
  }
}
