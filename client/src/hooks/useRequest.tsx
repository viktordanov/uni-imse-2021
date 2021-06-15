import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

type UseRequestPayload<T> = [T, () => void]

export function useRequest<T>(
  defaultValue: T | (() => T),
  requestURL: string,
  fetchData: RequestInit = {},
  dataTranformer?: (a: any) => any
): UseRequestPayload<T> {
  const { token } = useAuth()
  const [fetchedData, setFetchedData] = useState<T>(defaultValue)

  function refetch() {
    fetch(requestURL, {
      ...fetchData,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('failed to fetch ' + res.statusText)
      })
      .then((data: T) => {
        if (dataTranformer) setFetchedData(dataTranformer(data))
        else setFetchedData(data)
      })
      .catch(e => console.warn('Request ' + requestURL + '\n With data: ', fetchData, '\nfailed with error:', e))
  }
  useEffect(() => {
    refetch()
  }, [token])

  return [fetchedData, refetch]
}

export function useRequestArg<T>(
  defaultValue: T | (() => T),
  requestURL: string,
  arg: string | number,
  fetchData: RequestInit = {}
): UseRequestPayload<T> {
  const { token } = useAuth()
  const [fetchedData, setFetchedData] = useState<T>(defaultValue)

  function refetch() {
    fetch(requestURL + '/' + arg, {
      ...fetchData,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('failed to fetch ' + res.statusText)
      })
      .then((data: T) => {
        setFetchedData(data)
      })
      .catch(e => console.warn('Request ' + requestURL + '\n With data: ', fetchData, '\nfailed with error:', e))
  }
  useEffect(() => {
    refetch()
  }, [token, arg])

  return [fetchedData, refetch]
}
