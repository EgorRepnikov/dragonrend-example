const { request } = require('../utils')
const { Article, User } = require('../../models')

describe('Article API', () => {
  const testArticle = {
    body: 'Test text'
  }
  let authHeader
  beforeAll(async () => {
    const testUser = {
      name: 'Test Test',
      email: 'test@test.com',
      password: 'password'
    }
    await request.post('auth/register', {
      json: true,
      body: testUser
    })
    const res = await request.post('auth/login', {
      json: true,
      body: testUser
    })
    authHeader = {
      Authorization: `Bearer ${res.body.token}`
    }
    const user = await User.findOne()
    testArticle.user = user._id
  })
  beforeEach(async () => await Article.remove())
  describe('POST /articles', () => {
    it('creates an article', async () => {
      const res = await request.post('articles', {
        json: true,
        body: testArticle,
        headers: authHeader
      })
      expect(res.statusCode).toBe(201)
      expect(res.body._id).not.toBe(undefined)
      expect(res.body.body).toBe(testArticle.body)
      expect(res.body.user).toBe(testArticle.user.toString())
      expect(res.body.createdDate).not.toBe(undefined)
    })
    it('creates an invalid article', async () => {
      const res = await request.post('articles', {
        json: true,
        body: { body: '' },
        headers: authHeader
      })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Bad Request')
    })
  })
  describe('GET /articles', () => {
    it('gets all articles', async () => {
      const article = await new Article(testArticle).save()
      const res = await request.get('articles?skip=0&limit=1', { json: true })
      expect(res.statusCode).toBe(200)
      expect(res.body[0]._id).toBe(article._id.toString())
      expect(res.body[0].body).toBe(article.body)
      expect(res.body[0].user).toBe(article.user.toString())
      expect(res.body[0].createdDate).toBe(article.createdDate.toISOString())
    })
    it('gets all articles by user', async () => {
      const article = await new Article(testArticle).save()
      const res = await request.get(
        `articles?skip=0&limit=1&user=${article.user._id.toString()}`,
        { json: true }
      )
      expect(res.statusCode).toBe(200)
      expect(res.body[0]._id).toBe(article._id.toString())
      expect(res.body[0].body).toBe(article.body)
      expect(res.body[0].user).toBe(article.user.toString())
      expect(res.body[0].createdDate).toBe(article.createdDate.toISOString())
    })
    it('gets all articles by no existed user', async () => {
      await new Article(testArticle).save()
      const res = await request.get('articles?skip=0&limit=1&user=noop', { json: true })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Bad Request')
    })
  })
  describe('GET /articles/:id', () => {
    it('gets the article by id', async () => {
      const article = await new Article(testArticle).save()
      const res = await request.get('articles/' + article._id.toString(), { json: true })
      expect(res.statusCode).toBe(200)
      expect(res.body._id).toBe(article._id.toString())
      expect(res.body.body).toBe(article.body)
      expect(res.body.user).toBe(article.user.toString())
      expect(res.body.createdDate).toBe(article.createdDate.toISOString())
    })
    it('gets the article by no existed id', async () => {
      const res = await request.get('articles/5c83ed13faa2ea92348d8be4', { json: true })
      expect(res.statusCode).toBe(404)
    })
  })
  describe('PUT /articles', () => {
    it('updates the article', async () => {
      const article = await new Article(testArticle).save()
      article.body = 'Edited body'
      const res = await request.put('articles', {
        json: true,
        body: article,
        headers: authHeader
      })
      expect(res.statusCode).toBe(200)
      expect(res.body._id).toBe(article._id.toString())
      expect(res.body.body).toBe(article.body)
      expect(res.body.user).toBe(article.user.toString())
      expect(res.body.createdDate).toBe(article.createdDate.toISOString())
    })
  })
  describe('DELETE /articles', () => {
    it('deletes the article', async () => {
      const article = await new Article(testArticle).save()
      const res = await request.delete(`articles/${article._id.toString()}`, {
        headers: authHeader
      })
      expect(res.statusCode).toBe(200)
      const articles = await Article.find()
      expect(articles.length).toBe(0)
    })
  })
})
