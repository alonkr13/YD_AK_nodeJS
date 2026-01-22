require('dotenv').config()
const express = require('express')
const { MongoClient } = require('mongodb')
const pino = require('pino')
const pinoHttp = require('pino-http')

const app = express()
app.use(express.json())

const mongoUri = process.env.MONGO_URI
const dbName = 'cost_manager'
let db
let logsCollection

// MongoDB connection
const dbReady = MongoClient.connect(mongoUri)
    .then(client => {
        db = client.db(dbName)
        logsCollection = db.collection('logs')
        console.log('MongoDB connected for logs-service')
        return client
    })
    .catch(err => {
        console.error('MongoDB connection error:', err)
    })

app.dbReady = dbReady

// Pino setup
const logger = pino()
app.use(pinoHttp({ logger }))

// Log every request EXCEPT /api/logs
app.use(async (req, res, next) => {
    if (!logsCollection) return next()
    if (req.path === '/api/logs') return next()

    try {
        await logsCollection.insertOne({
            message: `Request: ${req.method} ${req.path}`,
            method: req.method,
            path: req.path,
            timestamp: new Date()
        })
    } catch (err) {
        console.error('Failed to save log:', err)
    }

    next()
})

// GET all logs
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await logsCollection.find({}).toArray()
        res.json(logs)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = app
