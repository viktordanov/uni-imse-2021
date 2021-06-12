const host = 'http://localhost:10100/'
export const APIEndpoints = {
  login: host + 'auth/login',
  signup: host + 'auth/signup',
  getFollowed: host + 'api/followed',
  getPages: host + 'api/pages',
  getStudentInfo: (email: string): string => host + 'api/info/' + encodeURI(email),
  getPagesOfStudent: (email: string): string => host + 'api/pages/' + encodeURI(email),
  getPostsOfStudent: (email: string, pageTitle: string): string =>
    host + 'api/posts/student/' + encodeURI(email) + '/' + encodeURI(pageTitle),
  getLiked: host + 'api/liked',
  likePost: host + 'api/posts/like',
  unlikePost: host + 'api/posts/unlike',
  getFeed: host + 'api/feed',
  getAllStudents: host + 'api/students',
  follow: host + 'api/follow',
  unfollow: host + 'api/unfollow',
  newPage: host + 'api/pages',
  newPost: (page: string): string => host + 'api/posts/new/' + encodeURI(page),
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
