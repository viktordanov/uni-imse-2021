import { Page, Admin, Student, Post, Event, Account, ReportStudentActivity, ReportFamousStudents } from './entities'

export interface Repository {
  // Page CRUD
  addPage(studentId: number, page: Page): Promise<boolean>
  removePage(studentId: number, title: string): Promise<boolean>
  getPageByTitle(studentId: number, title: string): Promise<[Page, boolean]>
  updatePage(studentId: number, page: Page): Promise<boolean>

  // Post CRUD
  addPost(studentId: number, pageTitle: string, post: Post): Promise<boolean>
  removePost(studentId: number, pageTitle: string, title: string): Promise<boolean>
  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<[Post, boolean]>
  updatePost(studentId: number, pageTitle: string, post: Post): Promise<boolean>
  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<[Student[], boolean]>

  // Account auth
  getAccountByEmail(email: string): Promise<[Account, boolean]>

  // Student CRUD
  addStudent(s: Student): Promise<boolean>
  removeStudent(id: number): Promise<boolean>
  getStudentById(id: number): Promise<[Student, boolean]>
  updateStudent(s: Student): Promise<boolean>
  getAllStudents(): Promise<[Student[], boolean]>

  // Student followers
  getFollowersOf(id: number): Promise<[Student[], boolean]>
  getFollowing(id: number): Promise<[Student[], boolean]>
  addFollow(who: number, followsWhom: number): Promise<boolean>
  removeFollow(who: number, followsWhom: number): Promise<boolean>

  // Student likes
  getLikedPostsOf(id: number): Promise<[Post[], boolean]>
  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean>
  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean>

  // Admin CRUD
  addAdmin(s: Admin): Promise<boolean>
  removeAdmin(id: number): Promise<boolean>
  getAdminById(id: number): Promise<[Admin, boolean]>
  updateAdmin(s: Admin): Promise<boolean>
  getAllAdmins(): Promise<[Admin[], boolean]>

  // Event CRUD
  addEvent(e: Event): Promise<boolean>
  removeEvent(id: number): Promise<boolean>
  getEventById(id: number): Promise<[Event, boolean]>
  getEventByName(name: string): Promise<[Event, boolean]>
  updateEvent(e: Event): Promise<boolean>
  getAllEvents(): Promise<[Event[], boolean]>

  // All pages/posts/events
  getAllPagesOf(studentId: number): Promise<[Page[], boolean]>
  getAllPostsOf(studentId: number, pageTitle: string): Promise<[Post[], boolean]>
  getAllEventsCreatedBy(adminId: number): Promise<[Event[], boolean]>

  // Reports
  getReportStudentActivity(weeks: number): Promise<[ReportStudentActivity[], boolean]>
  getReportFamousStudents(): Promise<[ReportFamousStudents[], boolean]>
}
