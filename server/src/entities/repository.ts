import { Page, Admin, Student, Post, Event, AccountType } from './entities'

export interface Repository {
  // Page CRUD
  addPage(studentId: number, page: Page): void
  removePage(studentId: number, title: string): void
  getPageByTitle(studentId: number, title: string): Promise<Page>
  updatePage(studentId: number, page: Page): void

  // Post CRUD
  addPost(studentId: number, pageTitle: string, post: Post): void
  removePost(studentId: number, pageTitle: string, title: string): void
  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<Post>
  updatePost(studentId: number, pageTitle: string, post: Post): void
  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<Student[]>

  // Account auth
  getAccountByEmail(email: string): Promise<AccountType>

  // Student CRUD
  addStudent(s: Student): void
  removeStudent(id: number): void
  getStudentById(id: number): Promise<Student>
  updateStudent(s: Student): void
  getAllStudents(): Promise<Student[]>

  // Student followers
  getFollowersOf(id: number): Promise<Student[]>
  addFollow(who: number, followsWhom: number): void
  removeFollow(who: number, followsWhom: number): void

  // Student likes
  getLikedPostsOf(id: number): Promise<Post[]>
  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void
  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void

  // Admin CRUD
  addAdmin(s: Admin): void
  removeAdmin(id: number): void
  getAdminById(id: number): Promise<Admin>
  updateAdmin(s: Admin): void
  getAllAdmins(): Promise<Admin[]>

  // Event CRUD
  addEvent(e: Event): void
  removeEvent(id: number): void
  getEventById(id: number): Promise<Event>
  getEventByName(name: string): Promise<Event>
  updateEvent(e: Event): void
  getAllEvents(): Promise<Event[]>

  // All pages/posts/events
  getAllPagesOf(studentId: number): Promise<Page[]>
  getAllPostsOf(studentId: number, pageTitle: string): Promise<Post[]>
  getAllEventsCreatedBy(adminId: number): Promise<Event[]>
}
