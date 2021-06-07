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
    throw new Error('Method not implemented.')
  }

  removeAdmin(id: number): void {
    throw new Error('Method not implemented.')
  }

  getAdminById(id: number): Promise<Admin> {
    throw new Error('Method not implemented.')
  }

  updateAdmin(s: Admin): void {
    throw new Error('Method not implemented.')
  }

  getAllAdmins(): Promise<Admin[]> {
    throw new Error('Method not implemented.')
  }

  addEvent(e: Event): void {
    throw new Error('Method not implemented.')
  }

  removeEvent(id: number): void {
    throw new Error('Method not implemented.')
  }

  getEventById(id: number): Promise<Event> {
    throw new Error('Method not implemented.')
  }

  getEventByName(name: string): Promise<Event> {
    throw new Error('Method not implemented.')
  }

  updateEvent(e: Event): void {
    throw new Error('Method not implemented.')
  }

  getAllEvents(): Promise<Event[]> {
    throw new Error('Method not implemented.')
  }

  getAllPagesOf(studentId: number): Promise<Page[]> {
    throw new Error('Method not implemented.')
  }

  getAllPostsOf(studentId: number, pageTitle: string): Promise<Post[]> {
    throw new Error('Method not implemented.')
  }

  getAllEventsCreatedBy(adminId: number): Promise<Event[]> {
    throw new Error('Method not implemented.')
  }
}
