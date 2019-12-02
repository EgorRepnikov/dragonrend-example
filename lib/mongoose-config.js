const mongoose = require('mongoose')

const config = require('./config')

module.exports = () =>
  mongoose
    .connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(instance => {
      console.log('MongoDB has been connected')
      return instance
    })
    .catch(e => console.log(e))
