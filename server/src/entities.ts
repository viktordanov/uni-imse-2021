import { Duration } from './duration'

type Account = {
  id: number
  name: string
  email: string
  passwordHash: string
  dateRegistered: Date
  accountType: 'admin' | 'student'
}

export type Admin = Account & { address: string; ssn: number; accountType: 'admin' }
export type Student = Account & { university: string; matNumber: string; accountType: 'student' }

export type AccountType = Admin | Student

export type Page = { title: string; description: string; dateCreated: Date }
export type Post = { title: string; content: string; dateCreated: Date }

export type Event = { id: number; name: string; description: string; duration: Duration; date: Date }

export interface Repository {
  // Page CRUD
  addPage(studentId: number, page: Page): void
  removePage(studentId: number, title: string): void
  getPageByTitle(studentId: number, title: string): Page
  updatePage(studentId: number, page: Page): void

  // Post CRUD
  addPost(studentId: number, pageTitle: string, post: Post): void
  removePost(studentId: number, pageTitle: string, title: string): void
  getPostByTitle(studentId: number, pageTitle: string, title: string): Post
  updatePost(studentId: number, pageTitle: string, post: Post): void
  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Student[]

  // Student CRUD
  addStudent(s: Student): void
  removeStudent(id: number): void
  getStudentById(id: number): Student
  updateStudent(s: Student): void
  getAllStudents(): Student[]

  // Student followers
  getFollowersOf(id: number): Student[]
  addFollow(who: number, followsWhom: number): void
  removeFollow(who: number, followsWhom: number): void

  // Student likes
  getLikedPostsOf(id: number): Post[]
  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void
  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): void

  // Admin CRUD
  addAdmin(s: Admin): void
  removeAdmin(id: number): void
  getAdminById(id: number): Admin
  updateAdmin(s: Admin): void
  getAllAdmins(): Admin[]

  // Event CRUD
  addEvent(e: Event): void
  removeEvent(id: number): void
  getEventById(id: number): Event
  getEventByName(name: string): Event
  updateEvent(e: Event): void
  getAllEvents(): Event[]

  // All pages/posts/events
  getAllPagesOf(studentId: number): Page[]
  getAllPostsOf(studentId: number, pageTitle: string): Post[]
  getAllEventsCreatedBy(adminId: number): Event[]
}
