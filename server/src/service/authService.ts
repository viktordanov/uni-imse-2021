import { Repository } from '../entities/repository'
import bcrypt from 'bcrypt'
import { JWTUtil } from '../jwt'

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

    const isValid = bcrypt.compareSync(password, account.passwordHash)
    if (isValid) {
      return [JWTUtil.signJWT(this.jwtSecret), null]
    }
    return ['', new Error('Unauthorized')]
  }
}
