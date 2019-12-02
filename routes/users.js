const { routing, json } = require('dragonrend')

const { User } = require('../models')

const { GET } = module.exports = routing({ prefix: '/users' })

GET('/:_id', async ctx => {
  const user = await User.findById(ctx.request.params._id)
  return user ?
    json(user) :
    json(404, { error: 'User has not been found' })
})
