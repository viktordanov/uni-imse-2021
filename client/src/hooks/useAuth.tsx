import useLocalStorage from '@rehooks/local-storage'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { useMemo } from 'react'

interface UseAuthPayload {
  token: string | null
  isAuthenticated: boolean
  setToken: (s: string) => void
  decodedToken: JwtPayload | null
}

export function useAuth(): UseAuthPayload {
  const [token, setToken] = useLocalStorage<string>('jwt')
  const [isAuthenticated, decodedToken] = useMemo<[boolean, JwtPayload | null]>(() => {
    if (typeof token !== 'string') return [false, null]

    try {
      const decoded = jwt_decode<JwtPayload>(token)
      return [true, decoded]
    } catch (e) {
      console.warn(e)
      return [false, null]
    }
  }, [token])

  return { token, decodedToken, isAuthenticated, setToken }
}
