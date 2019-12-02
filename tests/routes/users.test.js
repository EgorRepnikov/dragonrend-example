const { request } = require('../utils')
const { User } = require('../../models')

describe('Users API', () => {
  const testUser = {
    name: 'Test Test',
    email: 'test@test.com',
    password: 'password'
  }
  beforeEach(async () => await User.remove())
  describe('GET /users/:id', () => {
    it('gets the user by id', async () => {
      const user = await new User(testUser).save()
      const res = await request.get(`users/${user._id.toString()}`, { json: true })
      expect(res.statusCode).toBe(200)
      expect(res.body._id).toBe(user._id.toString())
      expect(res.body.name).toBe(user.name)
      expect(res.body.email).toBe(user.email)
      expect(res.body.password).toBe(undefined)
      expect(res.body.createdDate).toBe(user.createdDate.toISOString())
    })
    it('gets the user by no existed id', async () => {
      const res = await request.get('users/5c83ed13faa2ea92348d8be4', { json: true })
      expect(res.statusCode).toBe(404)
    })
  })
})
