const { request } = require('../utils')
const { User } = require('../../models')

describe('User Auth API', () => {
  const testUser = {
    name: 'Test Test',
    email: 'test@test.com',
    password: 'password'
  }
  beforeEach(async () => await User.remove())
  describe('POST /auth/register', () => {
    it('registers user', async () => {
      const res = await request.post('auth/register', {
        json: true,
        body: testUser
      })
      expect(res.statusCode).toBe(201)
      const createdUser = await User.findOne({ email: testUser.email })
      expect(createdUser.name).toBe(testUser.name)
      expect(createdUser.email).toBe(testUser.email)
      expect(createdUser.password).not.toBe(undefined)
      expect(createdUser.createdDate).not.toBe(undefined)
    })
    it('registers one user twice', async () => {
      await request.post('auth/register', {
        json: true,
        body: testUser
      })
      const res = await request.post('auth/register', {
        json: true,
        body: testUser
      })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Email already exists')
    })
  })
  describe('POST /auth/login', () => {
    it('logs in user', async () => {
      await request.post('auth/register', {
        json: true,
        body: testUser
      })
      const res = await request.post('auth/login', {
        json: true,
        body: testUser
      })
      expect(res.statusCode).toBe(200)
      expect(res.body.token).not.toBe(undefined)
    })
    it('logs in with nonexistent user', async () => {
      const res = await request.post('auth/login', {
        json: true,
        body: {
          email: 'nonexistent@test.com',
          password: 'password'
        }
      })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('User with this email does not exist')
    })
    it('logs in with incorrect password', async () => {
      await request.post('auth/register', {
        json: true,
        body: testUser
      })
      const res = await request.post('auth/login', {
        json: true,
        body: {
          email: testUser.email,
          password: 'wrongpassword'
        }
      })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Password incorrect')
    })
  })
})
