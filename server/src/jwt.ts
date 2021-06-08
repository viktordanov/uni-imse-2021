import * as jwt from 'jsonwebtoken'
import { Account } from './entities/entities'

function signJWT(account: Account, jwtSecret: string): string {
  return jwt.sign(
    { sub: { name: account.name, email: account.email, id: account.id, type: account.accountType } },
    jwtSecret,
    { expiresIn: '24h' }
  )
}

export const JWTUtil = { signJWT }
