module.exports = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI || process.env.MONGO_URL,
  secret: process.env.SECRET || 'secret'
}
