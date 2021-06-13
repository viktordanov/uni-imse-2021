import { Collection, Db, MongoClient } from 'mongodb'
import {
  Page,
  Post,
  Student,
  Account,
  Admin,
  Event,
  ReportStudentActivity,
  ReportFamousStudents
} from '../entities/entities'
import { Repository } from '../entities/repository'

// type MongoStudent = {
//   _id: number
//   name: string
//   email: string
//   dateCreated: Date
//   passWord
// }

export class MongoRepository implements Repository {
  private client: MongoClient
  async initialize(): Promise<void> {
    this.client = await MongoClient.connect(
      'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASS + '@imse-mongodb:27017'
    )
    await Promise.all([
      this.client.db().createCollection('accounts'),
      this.client.db().createCollection('events'),
      this.client.db().createCollection('pages'),
      this.client.db().createCollection('posts')
    ])
  }

  db(): Db {
    return this.client.db()
  }

  accounts(): Collection {
    return this.db().collection('accounts')
  }

  events(): Collection {
    return this.db().collection('events')
  }

  posts(): Collection {
    return this.db().collection('posts')
  }

  pages(): Collection {
    return this.db().collection('pages')
  }

  async addPage(studentId: number, page: Page): Promise<boolean> {
    const res = await this.pages().insertOne(page)
    if (res.insertedCount !== 1) return false
    const res2 = await this.accounts().findOneAndUpdate({ _id: studentId }, { $push: { pages: res.insertedId } })
    return (res2.ok ?? 0) === 1
  }

  removePage(studentId: number, title: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getPageByTitle(studentId: number, title: string): Promise<[Page, boolean]> {
    throw new Error('Method not implemented.')
  }

  updatePage(studentId: number, page: Page): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  addPost(studentId: number, pageTitle: string, post: Post): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  removePost(studentId: number, pageTitle: string, title: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<[Post, boolean]> {
    throw new Error('Method not implemented.')
  }

  updatePost(studentId: number, pageTitle: string, post: Post): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<[Student[], boolean]> {
    throw new Error('Method not implemented.')
  }

  async getAccountByEmail(email: string): Promise<[Account, boolean]> {
    const res: Student = await this.accounts().findOne({ email })
    console.log(res)
    return [null, false]
  }

  async addStudent(s: Student): Promise<boolean> {
    const res = await this.accounts().insertOne(s)
    return res.insertedCount === 1
  }

  async removeStudent(id: number): Promise<boolean> {
    const res = await this.accounts().deleteOne({ _id: id })
    return res.deletedCount === 1
  }

  async getStudentById(id: number): Promise<[Student, boolean]> {
    // const res = await this.accounts().findOne({ _id: id })
    return [null, false]
  }

  async updateStudent(s: Student): Promise<boolean> {
    const res = await this.accounts().findOneAndUpdate({ _id: s.id }, { $set: s })
    return res.ok === 1
  }

  getAllStudents(): Promise<[Student[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getFollowersOf(id: number): Promise<[Student[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getFollowing(id: number): Promise<[Student[], boolean]> {
    throw new Error('Method not implemented.')
  }

  addFollow(who: number, followsWhom: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  removeFollow(who: number, followsWhom: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getLikedPostsOf(id: number): Promise<[Post[], boolean]> {
    throw new Error('Method not implemented.')
  }

  addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  addAdmin(s: Admin): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  removeAdmin(id: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getAdminById(id: number): Promise<[Admin, boolean]> {
    throw new Error('Method not implemented.')
  }

  updateAdmin(s: Admin): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getAllAdmins(): Promise<[Admin[], boolean]> {
    throw new Error('Method not implemented.')
  }

  addEvent(e: Event): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  removeEvent(id: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getEventById(id: number): Promise<[Event, boolean]> {
    throw new Error('Method not implemented.')
  }

  getEventByName(name: string): Promise<[Event, boolean]> {
    throw new Error('Method not implemented.')
  }

  updateEvent(e: Event): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getAllEvents(): Promise<[Event[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getAllPagesOf(studentId: number): Promise<[Page[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getAllPostsOf(studentId: number, pageTitle: string): Promise<[Post[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getAllEventsCreatedBy(adminId: number): Promise<[Event[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getReportStudentActivity(weeks: number): Promise<[ReportStudentActivity[], boolean]> {
    throw new Error('Method not implemented.')
  }

  getReportFamousStudents(searchPostTitle: string): Promise<[ReportFamousStudents[], boolean]> {
    throw new Error('Method not implemented.')
  }

  addRandomPost(p: Post): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  addRandomFollows(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  addRandomLikes(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
