require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express')
const mongoose = require('mongoose')
const pino = require('pino')
const pinoHttp = require('pino-http')
const User = require('./models/user.model')
const Cost = require('./models/cost.model')

// Create Pino logger with MongoDB transport
const transport = pino.transport({
    target: 'pino-mongodb',
    options: {
        uri: process.env.MONGO_URI,
        collection: 'logs'
    }
})

const logger = pino(transport)

const app = express()
app.use(express.json())
app.use(pinoHttp({ logger }))

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))

// Add a new user
app.post('/api/add', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday } = req.body
        const user = new User({ id, first_name, last_name, birthday })
        await user.save()
        res.json(user)
    } catch (err) {
        res.status(400).json({ id: req.body.id || null, message: err.message })
    }
})

// Get a specific user with total costs
app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const user = await User.findOne({ id: userId })

        if (!user) {
            return res.status(404).json({ id: userId, message: 'User not found' })
        }

        // Sum all costs for this user
        const costs = await Cost.find({ userid: userId })
        const total = costs.reduce((sum, c) => sum + c.sum, 0)

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total
        })
    } catch (err) {
        res.status(500).json({ id: req.params.id, message: err.message })
    }
})

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = app
