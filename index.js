require('dotenv').config()

const { app, mongooseConfig } = require('./app')
const { port } = require('./lib/config')

mongooseConfig()

app.start(port, () => console.log(`Server has been started ${config.port}`))
