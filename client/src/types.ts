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
  pageTitle: string
  title: string
  content: string
  dateCreated: Date
}
