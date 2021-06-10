import { Page, Post, Student } from '../entities/entities'
import { Repository } from '../entities/repository'
type APIResponse<T> = Promise<[T, Error | null]>
type APIVoid = Promise<Error>
export class StudentContentService {
  private repository: Repository
  constructor(repository: Repository) {
    this.repository = repository
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

  async getFollowed(id: number): APIResponse<Student[]> {
    const [following, ok] = await this.repository.getFollowing(id)
    if (!ok) {
      return [[], new Error('failed to get all followed students')]
    }
    return [following, null]
  }
}
