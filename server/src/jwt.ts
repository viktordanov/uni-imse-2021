import * as jwt from 'jsonwebtoken'
import { AccountType } from './entities/entities'

function signJWT(account: AccountType, jwtSecret: string): string {
  return jwt.sign({ slkdfjslkd: '' }, jwtSecret, { expiresIn: '24h' })
}

export const JWTUtil = { signJWT }
