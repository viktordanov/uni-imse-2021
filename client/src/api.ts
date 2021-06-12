const host = 'http://localhost:10100/'
export const APIEndpoints = {
  login: host + 'auth/login',
  signup: host + 'auth/signup',
  getFollowed: host + 'api/followed',
  getPages: host + 'api/pages',
  getPagesOfStudent: host + 'api/pages/:id',
  getFeed: host + 'api/feed',
  getAllStudents: host + 'api/students',
  follow: host + 'api/follow',
  unfollow: host + 'api/unfollow',
  newPage: host + 'api/pages',
  deletePage: host + 'api/pages'
}

export function makeRequest(
  url: string,
  method: 'get' | 'delete' | 'put' | 'post',
  body: unknown,
  token: string
): Promise<Response> {
  return fetch(url, {
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    method
  })
}
