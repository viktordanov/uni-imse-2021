import { RepositorySQL } from '../sql/repositorySQL'
import { MongoRepository } from './mongoRepo'

export class DataMigration {
  async migrateDataToMongo(sqlRepo: RepositorySQL, mongoRepo: MongoRepository): Promise<void> {
    const students = await sqlRepo.getAllStudents()
    const promises: Promise<boolean>[] = []
    students[0].forEach(async student => {
      promises.push(mongoRepo.addStudent(student))
      const pages = await sqlRepo.getAllPagesOf(student.id)
      pages[0].forEach(async page => {
        promises.push(mongoRepo.addPage(student.id, page))
        const posts = await sqlRepo.getAllPostsOf(student.id, page.title)
        posts[0].forEach(async post => {
          promises.push(mongoRepo.addPost(student.id, page.title, post))
        })
      })
    })

    Promise.all(promises).then(() => {
      students[0].forEach(async student => {
        const following = await sqlRepo.getFollowing(student.id)
        following[0].forEach(async toFollow => {
          await mongoRepo.addFollow(student.id, toFollow.id)
        })

        const likedPosts = await sqlRepo.getLikedPagePostsOf(student.id)
        likedPosts[0].forEach(async likedPost => {
          await mongoRepo.addLike(student.id, likedPost.pageOwnerId, likedPost.pageTitle, likedPost.title)
        })
      })
    })
  }
}
