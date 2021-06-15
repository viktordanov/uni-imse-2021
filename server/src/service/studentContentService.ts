import { Admin, Page, Post, ReportFamousStudents, ReportStudentActivity, Student } from '../entities/entities'
import { Repository } from '../entities/repository'
type APIResponse<T> = Promise<[T, Error | null]>
type APIVoid = Promise<Error>
export class StudentContentService {
  private repository: Repository
  constructor(repository: Repository) {
    this.repository = repository
  }

  getRepository(): Repository {
    return this.repository
  }

  setRepository(repo: Repository): void {
    this.repository = repo
  }

  async addAdminAccount(admin: Partial<Admin>): APIVoid {
    const ok = await this.repository.addAdmin(admin as Admin)
    if (!ok) return new Error('failed to register admin account')
    return null
  }

  async getPagesOfStudent(studentID: number): APIResponse<Page[]> {
    const [pages, ok] = await this.repository.getAllPagesOf(studentID)
    if (!ok) {
      return [[], new Error('failed to get pages')]
    }
    return [pages, null]
  }

  async addPageToStudent(studentID: number, page: Page): APIVoid {
    const ok = await this.repository.addPage(studentID, page)
    if (!ok) {
      return new Error('failed to add page')
    }
    return null
  }

  async removePageFromStudent(studentID: number, pageTitle: string): APIVoid {
    const ok = await this.repository.removePage(studentID, pageTitle)
    if (!ok) {
      return new Error('failed to remove page')
    }
    return null
  }

  async getPostsOfPage(studentID: number, pageTitle: string): APIResponse<Post[]> {
    const [posts, ok] = await this.repository.getAllPostsOf(studentID, pageTitle)
    if (!ok) {
      return [[], new Error('failed to get posts of page ' + pageTitle)]
    }
    return [posts, null]
  }

  async addPostToStudent(studentID: number, pageTitle: string, post: Post): APIVoid {
    const ok = await this.repository.addPost(studentID, pageTitle, post)
    if (!ok) {
      return new Error('failed to add post')
    }
    return null
  }

  async getAllStudents(): APIResponse<Student[]> {
    const [students, ok] = await this.repository.getAllStudents()
    if (!ok) {
      return [[], new Error('failed to get all students')]
    }
    return [students, null]
  }

  async getStudentById(id: number): APIResponse<Student> {
    const [student, ok] = await this.repository.getStudentById(id)
    if (!ok) {
      return [null, new Error('failed to get student by id')]
    }
    return [student, null]
  }

  async getStudentByEmail(email: string): APIResponse<Student> {
    const [account, ok] = await this.repository.getAccountByEmail(email)
    if (!ok) {
      return [null, new Error('failed to get account by email')]
    }
    const [student, ok2] = await this.repository.getStudentById(account.id)
    if (!ok2) {
      return [null, new Error('failed to get student by id')]
    }
    return [student, null]
  }

  async followStudent(studentID: number, idToFollow: number): APIVoid {
    const ok = await this.repository.addFollow(studentID, idToFollow)
    if (!ok) return new Error('failed to add follow relationship')
    return null
  }

  async unfollowStudent(studentID: number, idToFollow: number): APIVoid {
    const ok = await this.repository.removeFollow(studentID, idToFollow)
    if (!ok) return new Error('failed to remove follow relationship')
    return null
  }

  async getFollowed(id: number): APIResponse<Student[]> {
    const [following, ok] = await this.repository.getFollowing(id)
    if (!ok) {
      return [[], new Error('failed to get all followed students')]
    }
    return [following, null]
  }

  async likePost(id: number, whosePostId: number, pageTitle: string, postTitle: string): APIVoid {
    const ok = await this.repository.addLike(id, whosePostId, pageTitle, postTitle)
    if (!ok) {
      return new Error('failed to set like post relationship')
    }
    return null
  }

  async unlikePost(id: number, whosePostId: number, pageTitle: string, postTitle: string): APIVoid {
    const ok = await this.repository.removeLike(id, whosePostId, pageTitle, postTitle)
    if (!ok) {
      return new Error('failed to set unlike post relationship')
    }
    return null
  }

  async getLikedPosts(studentID: number): APIResponse<Post[]> {
    const [posts, ok] = await this.repository.getLikedPostsOf(studentID)
    if (!ok) {
      return [[], new Error('failed to get liked posts')]
    }
    return [posts, null]
  }

  async getReportStudentActivity(weeks: number): APIResponse<ReportStudentActivity[]> {
    const [report, ok] = await this.repository.getReportStudentActivity(weeks)
    if (!ok) {
      return [[], new Error('failed to get student activity report')]
    }
    return [report, null]
  }

  async getReportFamousStudents(searchPostTitle: string): APIResponse<ReportFamousStudents[]> {
    const [report, ok] = await this.repository.getReportFamousStudents(searchPostTitle)
    if (!ok) {
      return [[], new Error('failed to get famous students report')]
    }
    return [report, null]
  }
}
