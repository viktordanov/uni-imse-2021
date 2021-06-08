import { Repository } from '../entities/repository'
import bcrypt from 'bcrypt'
import { JWTUtil } from '../jwt'
import { Account, Student } from '../entities/entities'

type APIResponse<T> = Promise<[T, Error | null]>

export class AuthService {
  private repository: Repository
  private jwtSecret: string

  constructor(repository: Repository, jwtSecret: string) {
    this.repository = repository
    this.jwtSecret = jwtSecret
  }

  async login(email: string, password: string): APIResponse<string> {
    const account = await this.repository.getAccountByEmail(email)
    if (account.id === undefined) {
      return ['', new Error('Unauthorized')]
    }
    console.log(account)

    const isValid = bcrypt.compareSync(password, account.passwordHash)
    if (isValid) {
      return [JWTUtil.signJWT(account, this.jwtSecret), null]
    }
    return ['', new Error('Unauthorized')]
  }

  async studentSignup(
    name: string,
    email: string,
    password: string,
    university: string,
    matNumber: string
  ): APIResponse<string> {
    let existing = await this.repository.getAccountByEmail(email)
    if (existing.id !== undefined) {
      return ['', new Error('Account already exists')]
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const student: Student = {
      id: 0,
      accountType: 'student',
      dateRegistered: new Date(),
      email,
      matNumber,
      name,
      university,
      passwordHash
    }

    await this.repository.addStudent(student)
    existing = await this.repository.getAccountByEmail(email)

    if (existing.id === undefined) {
      return ['', new Error('Something went wrong')]
    }

    return [JWTUtil.signJWT(existing, this.jwtSecret), null]
  }
}
