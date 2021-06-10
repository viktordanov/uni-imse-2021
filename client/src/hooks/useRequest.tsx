import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

type UseRequestPayload<T> = T

export function useRequest<T>(
  defaultValue: T | (() => T),
  requestURL: string,
  fetchData: RequestInit = {}
): UseRequestPayload<T> {
  const { token } = useAuth()
  const [fetchedData, setFetchedData] = useState<T>(defaultValue)

  useEffect(() => {
    fetch(requestURL, { ...fetchData, headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then((data: T) => setFetchedData(data))
      .catch(e => console.warn('Request ' + requestURL + '\n With data: ', fetchData, '\nfailed with error:', e))
  }, [token])

  return fetchedData
}
