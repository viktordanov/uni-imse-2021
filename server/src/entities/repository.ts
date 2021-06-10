import { Page, Admin, Student, Post, Event, Account } from './entities'

export interface Repository {
  // Page CRUD
  addPage(studentId: number, page: Page): Promise<boolean>
  removePage(studentId: number, title: string): Promise<boolean>
  getPageByTitle(studentId: number, title: string): Promise<Page>
  updatePage(studentId: number, page: Page): Promise<boolean>

  // Post CRUD
  addPost(studentId: number, pageTitle: string, post: Post): Promise<boolean>
  removePost(studentId: number, pageTitle: string, title: string): Promise<boolean>
  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<Post>
  updatePost(studentId: number, pageTitle: string, post: Post): Promise<boolean>
  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<Student[]>

  // Account auth
  getAccountByEmail(email: string): Promise<Account>

  // Student CRUD
  addStudent(s: Student): Promise<boolean>
  removeStudent(id: number): Promise<boolean>
  getStudentById(id: number): Promise<Student>
  updateStudent(s: Student): Promise<boolean>
  getAllStudents(): Promise<Student[]>

  // Student followers
  getFollowersOf(id: number): Promise<Student[]>
  addFollow(who: number, followsWhom: number): Promise<boolean>
  removeFollow(who: number, followsWhom: number): Promise<boolean>

  // Student likes
  getLikedPostsOf(id: number): Promise<Post[]>
  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean>
  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean>

  // Admin CRUD
  addAdmin(s: Admin): Promise<boolean>
  removeAdmin(id: number): Promise<boolean>
  getAdminById(id: number): Promise<Admin>
  updateAdmin(s: Admin): Promise<boolean>
  getAllAdmins(): Promise<Admin[]>

  // Event CRUD
  addEvent(e: Event): Promise<boolean>
  removeEvent(id: number): Promise<boolean>
  getEventById(id: number): Promise<Event>
  getEventByName(name: string): Promise<Event>
  updateEvent(e: Event): Promise<boolean>
  getAllEvents(): Promise<Event[]>

  // All pages/posts/events
  getAllPagesOf(studentId: number): Promise<Page[]>
  getAllPostsOf(studentId: number, pageTitle: string): Promise<Post[]>
  getAllEventsCreatedBy(adminId: number): Promise<Event[]>
}
