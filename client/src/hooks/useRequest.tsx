import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

type UseRequestPayload<T> = T

export function useRequest<T>(
  defaultValue: T | (() => T),
  requestURL: string,
  fetchData: RequestInit = {},
  dataTranformer?: (a: any) => any
): UseRequestPayload<T> {
  const { token } = useAuth()
  const [fetchedData, setFetchedData] = useState<T>(defaultValue)

  useEffect(() => {
    fetch(requestURL, { ...fetchData, headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('failed to fetch ' + res.statusText)
      })
      .then((data: T) => {
        if (dataTranformer) setFetchedData(dataTranformer(data))
        else setFetchedData(data)
      })
      .catch(e => console.warn('Request ' + requestURL + '\n With data: ', fetchData, '\nfailed with error:', e))
  }, [token])

  return fetchedData
}
