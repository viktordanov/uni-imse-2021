export type Student = {
  name: string
  email: string
  university: string
}

export type Page = {
  title: string
  description: string
  dateCreated: Date
  postCount: number
}

export type Post = {
  ownerName: string
  ownerEmail: string
  pageTitle: string
  title: string
  content: string
  dateCreated: Date
}

export type ReportStudentActivity = { sumPages: number; studentName: string; likedPosts: number; sumPosts: number }

export type ReportFamousStudents = {
  pageTitle: string
  title: string
  likes: number
  studentName: string
  studentFollowers: number
}
