const pino = require('pino')

const logger = pino({
    transport: {
        target: 'pino-mongodb',
        options: {
            uri: process.env.MONGO_URI,
            collection: 'logs',
        }
    }
})

module.exports = logger