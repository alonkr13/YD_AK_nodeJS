require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const pinoHttp = require('pino-http')

const logger = require('./logger')

const app = express()
app.use(express.json())

app.use(pinoHttp({ logger }))

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error(err))

app.get('/api/about', (req, res) => {
    req.log.info('GET /api/about accessed')

    const devs = [
        {
            first_name: process.env.DEV1_FIRST_NAME,
            last_name: process.env.DEV1_LAST_NAME
        },
        {
            first_name: process.env.DEV2_FIRST_NAME,
            last_name: process.env.DEV2_LAST_NAME
        }
    ]

    res.json(devs)
})

module.exports = app