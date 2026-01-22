require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const pino = require('pino')
const pinoHttp = require('pino-http')

const costRoutes = require('./routes/cost.routes')

const app = express()
const logger = pino()

app.use(express.json())
app.use(pinoHttp({ logger }))

mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => {
        logger.error(err)
        process.exit(1)
    })

app.use('/api', costRoutes)

app.listen(process.env.PORT, () => {
    logger.info(`Cost service running on port ${process.env.PORT}`)
})
