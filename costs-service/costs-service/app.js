require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const pino = require('pino-http')()
const Cost = require('./models/cost.model')

const app = express()
app.use(express.json())
app.use(pino)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

// Add cost
app.post('/api/add', async (req, res) => {
    try {
        const { id, description, category, sum, date } = req.body
        if (!id || !description || !category || sum === undefined) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const newCost = await Cost.create({ userid: Number(id), description, category, sum, date })
        res.status(200).json(newCost)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get monthly report
app.get('/api/report', async (req, res) => {
    try {
        const { id, year, month } = req.query
        if (!id || !year || !month) {
            return res.status(400).json({ message: 'Missing query parameters' })
        }

        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 1)

        const costItems = await Cost.find({
            userid: Number(id),
            date: { $gte: start, $lt: end }
        })

        const categories = ['food', 'health', 'housing', 'sport', 'education']
        const costs = categories.map(cat => {
            const items = costItems
                .filter(c => c.category === cat)
                .map(c => ({
                    sum: c.sum,
                    description: c.description,
                    day: new Date(c.date).getDate()
                }))
            return { [cat]: items }
        })

        res.json({ userid: Number(id), year: Number(year), month: Number(month), costs })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = app