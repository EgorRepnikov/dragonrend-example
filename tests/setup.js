const { app, mongooseConfig } = require('../app')

const config = require('../lib/config')

let mongoose

beforeAll(async () => {
  mongoose = await mongooseConfig()
  await app.start(config.port)
})

afterAll(async () => {
  await app.stop()
  mongoose.disconnect()
})
