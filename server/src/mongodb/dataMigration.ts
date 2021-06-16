import { RepositorySQL } from '../sql/repositorySQL'
import { MongoRepository } from './mongoRepo'

export const DataMigration = {
  async migrateDataToMongo(sqlRepo: RepositorySQL, mongoRepo: MongoRepository): Promise<void> {
    const admins = await sqlRepo.getAllAdmins()
    const students = await sqlRepo.getAllStudents()

    for await (const admin of admins[0]) {
      await mongoRepo.addAdmin(admin)
    }

    for await (const student of students[0]) {
      await mongoRepo.addStudent(student)
      const pages = await sqlRepo.getAllPagesOf(student.id)
      for await (const page of pages[0]) {
        await mongoRepo.addPage(student.id, page)
        const posts = await sqlRepo.getAllPostsOf(student.id, page.title)
        for await (const post of posts[0]) {
          await mongoRepo.addPost(student.id, page.title, post)
        }
      }
    }

    for await (const student of students[0]) {
      const following = await sqlRepo.getFollowing(student.id)
      for await (const follow of following[0]) {
        await mongoRepo.addFollow(student.id, follow.id)
      }
      const likedPosts = await sqlRepo.getLikedPagePostsOf(student.id)
      for await (const likedPost of likedPosts[0]) {
        await mongoRepo.addLike(student.id, likedPost.pageOwnerId, likedPost.pageTitle, likedPost.title)
      }
    }
  }
}
