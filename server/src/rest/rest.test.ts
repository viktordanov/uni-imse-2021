import supertest from 'supertest'
import { DefaultRestConfig, RestWebServer } from './rest'

test('GET /api/posts', async () => {
  const webServer = new RestWebServer(DefaultRestConfig())

  await supertest(webServer.getServer()).get('/').expect(200)

  await supertest(webServer.getServer()).get('/api/pages').expect(405)
  await supertest(webServer.getServer()).get('/api/posts').expect(405)
  await supertest(webServer.getServer()).get('/api/friends').expect(405)
})

/**
 * Supertest example
 * 
 *
  test('GET /api/posts', async () => {
  const webServer = new RestWebServer(DefaultRestConfig())

  await supertest(webServer.getServer())
    .get('/api/posts')
    .expect(200)
    .then(response => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body.length).toEqual(1)

      // Check data
      expect(response.body[0]._id).toBe(post.id)
      expect(response.body[0].title).toBe(post.title)
      expect(response.body[0].content).toBe(post.content)
    })
})

 */
