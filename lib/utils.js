const { json } = require('dragonrend')
const jwt = require('jsonwebtoken')

const config = require('../lib/config')

const unauthorized = json(401, { error: 'Unauthorized' })

exports.authenticate = ctx => {
  const { authorization } = ctx.request.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      const token = authorization.slice(7, authorization.length)
      ctx.user = jwt.verify(token, config.secret)
    } catch {
      return unauthorized
    }
  } else {
    return unauthorized
  }
}
