const pino = require('pino')
const pinoMongo = require('pino-mongodb')

// MongoDB connection string
const mongoUri = process.env.MONGO_URI

// Create Pino transport for MongoDB
const transport = pino.transport({
    target: 'pino-mongodb',
    options: { uri: mongoUri, collection: 'logs' }
})

// Create logger
const logger = pino(transport)

module.exports = logger
