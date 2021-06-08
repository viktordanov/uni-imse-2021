import * as jwt from 'jsonwebtoken'

function signJWT(jwtSecret: string): string {
  return jwt.sign({}, jwtSecret, { expiresIn: '24h' })
}

export const JWTUtil = { signJWT }
