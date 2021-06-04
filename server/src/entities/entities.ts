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
