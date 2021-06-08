import { Page, Post, Student, Admin, Event } from '../entities/entities'
import { Repository } from '../entities/repository'
import { SQLConnection as connection } from '../sql/sqlConnection'
import { SQLQueries as queries } from './sqlQueries'

export class RepositorySQL implements Repository {
  addPage(studentId: number, page: Page): void {
    connection.executeQuery(queries.addPage, [studentId, page.title, page.description, page.dateCreated])
  }

  removePage(studentId: number, title: string): void {
    connection.executeQuery(queries.removePage, [studentId, title])
  }

  getPageByTitle(studentId: number, title: string): Promise<Page> {
    return connection.executeScalarType<Page>(queries.getPageByTitle, [studentId, title])
  }

  updatePage(studentId: number, page: Page): void {
    connection.executeQuery(queries.updatePage, [page.title, page.description, page.dateCreated, studentId, page.title])
  }

  addPost(studentId: number, pageTitle: string, post: Post): void {
    connection.executeQuery(queries.addPost, [studentId, pageTitle, post.title, post.content, post.dateCreated])
  }

  removePost(studentId: number, pageTitle: string, title: string): void {
    connection.executeQuery(queries.removePost, [studentId, pageTitle, title])
  }

  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<Post> {
    return connection.executeScalarType<Post>(queries.getPostByTitle, [studentId, pageTitle, title])
  }

  updatePost(studentId: number, pageTitle: string, post: Post): void {
    connection.executeQuery(queries.updatePost, [post.content, post.dateCreated, studentId, pageTitle, post.title])
  }

  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<Student[]> {
    return connection.executeQueryType<Student>(queries.getStudentLikesOfPost, [studentId, pageTitle, postTitle])
  }

  addStudent(s: Student): void {
    connection.executeQuery(queries.addAccount, [s.name, s.email, s.passwordHash, s.dateRegistered])
    connection.executeQuery(queries.addStudent, [s.university, s.matNumber])
    connection.executeScalarType<number>(queries.selectLastInsertID, []).then(element => {
      s.id = element
    })
  }

  removeStudent(id: number): void {
    connection.executeQuery(queries.removeStudent, [id])
  }

  getStudentById(id: number): Promise<Student> {
    return connection.executeScalarType<Student>(queries.getStudentById, [id])
  }

  updateStudent(s: Student): void {
    connection.executeQuery(queries.updateStudent, [s.university, s.matNumber, s.id])
    connection.executeQuery(queries.updateAccount, [s.name, s.email, s.passwordHash, s.dateRegistered, s.id])
  }

  getAllStudents(): Promise<Student[]> {
    return connection.executeQueryType<Student>(queries.getStudentLikesOfPost, [])
  }

  getFollowersOf(id: number): Promise<Student[]> {
    return connection.executeQueryType<Student>(queries.getFollowersOf, [id])
  }

  addFollow(who: number, followsWhom: number): void {
    connection.executeQuery(queries.addFollow, [who, followsWhom])
  }

  removeFollow(who: number, followsWhom: number): void {
    connection.executeQuery(queries.removeFollow, [who, followsWhom])
  }

  getLikedPostsOf(id: number): Promise<Post[]> {
    return connection.executeQueryType<Post>(queries.getLikedPostsOf, [id])
  }

  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void {
    connection.executeQuery(queries.addLike, [who, whosePost, pageTitle, postTitle])
  }

  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void {
    connection.executeQuery(queries.removeLike, [who, whosePost, pageTitle, postTitle])
  }

  addAdmin(s: Admin): void {
    connection.executeQuery(queries.addAccount, [s.name, s.email, s.passwordHash, s.dateRegistered])
    connection.executeQuery(queries.addAdmin, [s.id, s.address, s.ssn])
    connection.executeScalarType<number>(queries.selectLastInsertID, []).then(element => {
      s.id = element
    })
  }

  removeAdmin(id: number): void {
    connection.executeQuery(queries.removeAdmin, [id])
  }

  getAdminById(id: number): Promise<Admin> {
    return connection.executeScalarType<Admin>(queries.getAdminById, [id])
  }

  updateAdmin(s: Admin): void {
    connection.executeQuery(queries.updateAdmin, [s.address, s.ssn, s.id])
  }

  getAllAdmins(): Promise<Admin[]> {
    return connection.executeQueryType<Admin>(queries.getAllAdmins, [])
  }

  addEvent(e: Event): void {
    connection.executeQuery(queries.addEvent, [e.name, e.description, e.duration, e.date])
    connection.executeScalarType<number>(queries.selectLastInsertID, []).then(element => {
      e.id = element
    })
  }

  removeEvent(id: number): void {
    connection.executeQuery(queries.removeEvent, [id])
  }

  getEventById(id: number): Promise<Event> {
    return connection.executeScalarType<Event>(queries.getEventById, [id])
  }

  getEventByName(name: string): Promise<Event> {
    return connection.executeScalarType<Event>(queries.getEventByName, [name])
  }

  updateEvent(e: Event): void {
    connection.executeQuery(queries.updateEvent, [e.id])
  }

  getAllEvents(): Promise<Event[]> {
    return connection.executeQueryType<Event>(queries.getAllEvents, [])
  }

  getAllPagesOf(studentId: number): Promise<Page[]> {
    return connection.executeQueryType<Page>(queries.getAllPagesOf, [studentId])
  }

  getAllPostsOf(studentId: number, pageTitle: string): Promise<Post[]> {
    return connection.executeQueryType<Post>(queries.getAllPostsOf, [studentId, pageTitle])
  }

  getAllEventsCreatedBy(adminId: number): Promise<Event[]> {
    return connection.executeQueryType<Event>(queries.getAllEventsCreatedBy, [adminId])
  }
}
