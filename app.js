const { dragonrend, json } = require('dragonrend')
const MongooseError = require('mongoose').Error

const mongooseConfig = require('./lib/mongoose-config')

const app = dragonrend({
  routing: {
    prefix: '/api'
  },
  autoIncluding: true,
  errorHandler(error, _) {
    if (error instanceof MongooseError) {
      return json(400, { error: 'Bad Request' })
    }
    return json(500, { error: 'Internal Server Error' })
  }
})

module.exports = { app, mongooseConfig }
