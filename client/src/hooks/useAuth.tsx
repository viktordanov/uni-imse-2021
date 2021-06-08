import jwt_decode, { JwtPayload } from 'jwt-decode'
import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface UseAuthPayload {
  token: string | null
  isAuthenticated: boolean
  setToken: (s: string | null) => void
  decodedToken: JwtPayload | null
}

export function useAuth(): UseAuthPayload {
  const [token, setToken] = useLocalStorage<string | null>('jwt', null)
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
