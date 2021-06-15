import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import {
  Account,
  Admin,
  Event,
  Page,
  Post,
  ReportFamousStudents,
  ReportStudentActivity,
  Student
} from '../entities/entities'
import { Repository } from '../entities/repository'

export class MongoRepository implements Repository {
  private client: MongoClient
  async initialize(): Promise<void> {
    this.client = await MongoClient.connect(
      'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@imse-mongodb:27017'
    )
    if ((await this.db().listCollections().toArray()).length === 0) {
      await Promise.all([
        this.db().createCollection('accounts'),
        this.db().createCollection('events'),
        this.db().createCollection('pages'),
        this.db().createCollection('posts')
      ])
    }
  }

  getType(): 'mongo' | 'sql' {
    return 'mongo'
  }

  db(): Db {
    return this.client.db('imse')
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
    const res2 = await this.accounts().findOneAndUpdate({ id: studentId }, { $push: { pages: res.insertedId } })
    return (res2.ok ?? 0) === 1
  }

  async removePage(studentId: number, title: string): Promise<boolean> {
    /* const res = await this.accounts().aggregate([
      { $lookup: { from: 'pages', localField: 'pages', foreignField: '_id', as: 'studentPages' } },
      { $match: { 'studentPages.title': title, id: studentId } },
      { $project: { studentPages: 1 } }
    ])
    const doc = await res.next()
    const pageId = doc.studentPages[0]._id */
    const pageId = await this.getPageObjectId(studentId, title)
    const del = await this.pages().deleteOne({ _id: pageId })
    return del.deletedCount === 1
  }

  getPageByTitle(studentId: number, title: string): Promise<[Page, boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  updatePage(studentId: number, page: Page): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  async addPost(studentId: number, pageTitle: string, post: Post): Promise<boolean> {
    /* const res = await this.accounts().aggregate([
      { $lookup: { from: 'pages', localField: 'pages', foreignField: '_id', as: 'studentPages' } },
      { $match: { 'studentPages.title': pageTitle, id: studentId } },
      { $project: { studentPages: 1 } }
    ])
    const doc = await res.next()
    if (!doc) return false
    console.log(doc)
    const pageId = doc.studentPages[0]._id */
    const pageId = await this.getPageObjectId(studentId, pageTitle)

    const res2 = await this.posts().insertOne(post)
    if (res2.insertedCount !== 1) return false
    const res3 = await this.pages().findOneAndUpdate({ _id: pageId }, { $push: { posts: res2.insertedId } })
    return (res3.ok ?? 0) === 1
  }

  removePost(studentId: number, pageTitle: string, title: string): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  getPostByTitle(studentId: number, pageTitle: string, title: string): Promise<[Post, boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  updatePost(studentId: number, pageTitle: string, post: Post): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  getStudentLikesOfPost(studentId: number, pageTitle: string, postTitle: string): Promise<[Student[], boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  async getAccountByEmail(email: string): Promise<[Account, boolean]> {
    const res: Student = await this.accounts().findOne({ email })
    if (res === null) return [null, false]
    return [res as Student, true]
  }

  async addStudent(s: Student): Promise<boolean> {
    if (s.id === 0) {
      const maxIDDoc = await this.accounts().find().sort({ id: -1 }).limit(1).next()

      s.id = maxIDDoc === null ? 0 : maxIDDoc.id + 1
    }
    const res = await this.accounts().insertOne(s)
    return res.insertedCount === 1
  }

  async removeStudent(id: number): Promise<boolean> {
    const res = await this.accounts().deleteOne({ _id: id })
    return res.deletedCount === 1
  }

  async getStudentById(id: number): Promise<[Student, boolean]> {
    const res = await this.accounts().findOne({ id: id })
    if (res === null) return [null, false]
    return [res as Student, true]
  }

  async updateStudent(s: Student): Promise<boolean> {
    const res = await this.accounts().findOneAndUpdate({ _id: s.id }, { $set: s })
    return res.ok === 1
  }

  async getAllStudents(): Promise<[Student[], boolean]> {
    const res = await this.accounts().find({ matNumber: { $exists: true } })
    if (res) {
      const list: Student[] = []
      while (await res.hasNext()) {
        const doc = await res.next()
        list.push(Object.assign({}, doc) as Student)
      }
      return [list, true]
    }

    return [null, false]
  }

  getFollowersOf(id: number): Promise<[Student[], boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  async getFollowing(id: number): Promise<[Student[], boolean]> {
    const res = await this.accounts().aggregate([
      { $lookup: { from: 'accounts', localField: 'followed_students', foreignField: '_id', as: 'followedStudents' } },
      { $match: { id: id } },
      { $project: { followedStudents: 1 } }
    ])

    if (res) {
      const list: Student[] = []
      const doc = await res.next()
      doc.followedStudents.forEach((element: Student) => {
        list.push(Object.assign({}, element) as Student)
      })
      return [list, true]
    }

    return [null, false]
  }

  async addFollow(who: number, followsWhom: number): Promise<boolean> {
    const res = await this.accounts().findOne({ id: followsWhom })
    if (res === null) return false

    const res2 = await this.accounts().findOneAndUpdate({ id: who }, { $push: { followed_students: res._id } })
    return (res2.ok ?? 0) === 1
  }

  async removeFollow(who: number, followsWhom: number): Promise<boolean> {
    const res = await this.accounts().findOne({ id: followsWhom })
    if (res === null) return false

    const res2 = await this.accounts().findOneAndUpdate({ id: who }, { $pull: { followed_students: res._id } })
    return (res2.ok ?? 0) === 1
  }

  async getLikedPostsOf(id: number): Promise<[Post[], boolean]> {
    const res = await this.accounts().aggregate([
      { $lookup: { from: 'posts', localField: 'liked_posts', foreignField: '_id', as: 'likedPosts' } },
      { $match: { id: id } },
      { $project: { likedPosts: 1 } }
    ])

    if (res) {
      const list: Post[] = []
      const doc = await res.next()
      doc.likedPosts.forEach((element: Post) => {
        list.push(Object.assign({}, element) as Post)
      })
      return [list, true]
    }

    return [null, false]
  }

  getLikedPagePostsOf(id: number): Promise<[({ pageOwnerId: number; pageTitle: string } & Post)[], boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  async addLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean> {
    const postId = await this.getPostObjectId(whosePost, pageTitle, postTitle)
    console.log(postId)
    if (postId == null) return false
    const res = await this.accounts().findOneAndUpdate({ id: who }, { $addToSet: { liked_posts: postId } })
    return (res.ok ?? 0) === 1
  }

  async removeLike(who: number, whosePost: number, pageTitle: string, postTitle: string): Promise<boolean> {
    const postId = await this.getPostObjectId(whosePost, pageTitle, postTitle)
    if (postId == null) return false
    const res = await this.accounts().findOneAndUpdate({ id: who }, { $pull: { liked_posts: postId } })
    return (res.ok ?? 0) === 1
  }

  async addAdmin(s: Admin): Promise<boolean> {
    const res = await this.accounts().insertOne(s)
    return res.insertedCount === 1
  }

  removeAdmin(id: number): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  getAdminById(id: number): Promise<[Admin, boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  updateAdmin(s: Admin): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  getAllAdmins(): Promise<[Admin[], boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  addEvent(e: Event): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  removeEvent(id: number): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  getEventById(id: number): Promise<[Event, boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  getEventByName(name: string): Promise<[Event, boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  updateEvent(e: Event): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  getAllEvents(): Promise<[Event[], boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  async getAllPagesOf(studentId: number): Promise<[Page[], boolean]> {
    const res = await this.accounts().aggregate([
      { $lookup: { from: 'pages', localField: 'pages', foreignField: '_id', as: 'studentPages' } },
      { $match: { id: studentId } },
      { $project: { studentPages: 1 } }
    ])
    if (res) {
      let list: Page[] = []
      while (await res.hasNext()) {
        const doc = await res.next()
        list.push(...(doc.studentPages as Page[]))
      }
      list = list.filter(p => p.title !== undefined)

      return [list, true]
    }
    return [null, false]
  }

  async getAllPostsOf(studentId: number, pageTitle: string): Promise<[Post[], boolean]> {
    const res = await this.accounts().aggregate([
      { $lookup: { from: 'pages', localField: 'pages', foreignField: '_id', as: 'studentPages' } },
      { $lookup: { from: 'posts', localField: 'studentPages.posts', foreignField: '_id', as: 'studentPosts' } },
      { $match: { id: studentId, 'studentPages.title': pageTitle } },
      { $project: { studentPosts: 1 } }
    ])
    if (res) {
      let list: Post[] = []

      while (await res.hasNext()) {
        const doc = await res.next()
        list.push(...(doc.studentPosts as Post[]))
      }
      list = list.filter(p => p.title !== undefined)
      return [list, true]
    }
    return [null, false]
  }

  getAllEventsCreatedBy(adminId: number): Promise<[Event[], boolean]> {
    // unused
    throw new Error('Method not implemented.')
  }

  async getReportStudentActivity(weeks: number): Promise<[ReportStudentActivity[], boolean]> {
    const date = new Date()
    date.setDate(date.getDate() - 7 * weeks)
    const res = await this.accounts().aggregate([
      { $lookup: { from: 'pages', localField: 'pages', foreignField: '_id', as: 'studentPages' } },
      { $match: {} },
      { $match: { dateRegistered: { $gte: date } } },
      {
        $project: {
          studentName: '$name',
          // sumPages: { $size: '$pages' },
          sumPages: {
            $cond: {
              if: { $isArray: '$pages' },
              then: { $size: '$pages' },
              else: 0
            }
          },
          sumPosts: {
            $reduce: {
              input: '$studentPages',
              initialValue: 0,
              in: {
                // $add: ['$$value', { $size: '$$this.posts' }]
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: { $isArray: '$$this.posts' },
                      then: { $size: '$$this.posts' },
                      else: 0
                    }
                  }
                ]
              }
            }
          },
          likedPosts: {
            $cond: {
              if: { $isArray: '$liked_posts' },
              then: { $size: '$liked_posts' },
              else: 0
            }
          }
        }
      }
    ])

    if (res) {
      const list: ReportStudentActivity[] = []
      while (await res.hasNext()) {
        const doc = await res.next()
        list.push(Object.assign({}, doc) as ReportStudentActivity)
      }
      return [list, true]
    }
    return [null, false]
  }

  async getReportFamousStudents(searchPostTitle: string): Promise<[ReportFamousStudents[], boolean]> {
    const search = '.*' + searchPostTitle + '.*'
    const res = await this.accounts().aggregate([
      { $unwind: { path: '$liked_posts' } },
      { $unwind: { path: '$liked_posts' } },
      { $group: { _id: '$liked_posts', likes: { $sum: 1 } } },
      { $lookup: { from: 'pages', localField: '_id', foreignField: 'posts', as: 'postPage' } },
      { $lookup: { from: 'accounts', localField: 'postPage._id', foreignField: 'pages', as: 'pageAccount' } },
      { $lookup: { from: 'posts', localField: '_id', foreignField: '_id', as: 'likedPost' } },
      { $match: { 'likedPost.title': { $regex: search } } },
      {
        $lookup: {
          from: 'accounts',
          localField: 'pageAccount._id',
          foreignField: 'followed_students',
          as: 'accountFollow'
        }
      },
      { $unwind: { path: '$accountFollow', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$accountFollow.followed_students', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$accountFollow.followed_students', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { postId: '$_id' },
          pageTitle: { $first: '$postPage.title' },
          title: { $first: '$likedPost.title' },
          likes: { $first: '$likes' },
          follows: { $sum: 1 },
          studentName: { $first: '$pageAccount.name' }
        }
      },
      {
        $project: {
          pageTitle: { $first: '$pageTitle' },
          title: { $first: '$title' },
          likes: '$likes',
          studentFollowers: '$follows',
          studentName: { $first: '$studentName' }
        }
      }
    ])

    if (res) {
      const list: ReportFamousStudents[] = []
      while (await res.hasNext()) {
        const doc = await res.next()
        list.push(Object.assign({}, doc) as ReportFamousStudents)
      }
      console.log(list)
      return [list, true]
    }
    return [null, false]
  }

  addRandomPost(p: Post): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  addRandomFollows(): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  addRandomLikes(): Promise<boolean> {
    // unused
    throw new Error('Method not implemented.')
  }

  async getPageObjectId(studentId: number, pageTitle: string): Promise<ObjectId> {
    const res = await this.accounts().aggregate([
      { $lookup: { from: 'pages', localField: 'pages', foreignField: '_id', as: 'studentPages' } },
      { $match: { 'studentPages.title': pageTitle, id: studentId } },
      { $project: { studentPages: 1 } }
    ])
    if (!res) return null
    const doc = await res.next()
    if (!doc) return null
    // return doc.studentPages[0]._id
    const postId = doc.studentPages.find((element: Page) => element.title === pageTitle)
    return postId
  }

  async getPostObjectId(studentId: number, pageTitle: string, postTitle: string): Promise<ObjectId> {
    console.log('getPostObjectId', studentId, pageTitle, postTitle)
    const pageId = await this.getPageObjectId(studentId, pageTitle)
    console.log('pageId', pageId)
    const res = await this.pages().aggregate([
      { $match: { _id: pageId } },
      { $lookup: { from: 'posts', localField: 'posts', foreignField: '_id', as: 'pagePosts' } },
      { $project: { pagePosts: 1 } },
      { $match: { 'pagePosts.title': postTitle } }
    ])
    if (!res) return null
    const doc = await res.next()
    if (!doc) return null
    const postId = doc.pagePosts.find((element: Page) => element.title === postTitle)
    return postId
  }
}
