const host = 'http://localhost:10100/'
export const APIEndpoints = {
  login: host + 'auth/login',
  signup: host + 'auth/signup',
  getFollowed: host + 'api/followed',
  getPages: host + 'api/pages',
  getFeed: host + 'api/feed'
}
