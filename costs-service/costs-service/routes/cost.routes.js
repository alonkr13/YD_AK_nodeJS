const express = require('express')
const router = express.Router()
const Cost = require('../models/cost.model')

router.get('/costs', async (req, res) => {
    try {
        const costs = await Cost.find()
        res.json(costs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get monthly report
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query
        if (!id || !year || !month) {
            return res.status(400).json({ message: 'Missing query parameters' })
        }

        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 1)

        const costs = await Cost.find({
            userid: Number(id),
            date: { $gte: start, $lt: end }
        })

        const categories = ['food','health','housing','sport','education','transportation','other']
        const report = {}
        categories.forEach(cat => {
            report[cat] = costs.filter(c => c.category === cat).reduce((acc, c) => acc + c.sum, 0)
        })

        res.json({ userid: Number(id), year: Number(year), month: Number(month), report })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/add', async (req, res) => {
    try {
        const { id, description, category, sum, date } = req.body
        if (!id || !description || !category || sum === undefined) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const newCost = await Cost.create({ 
            userid: Number(id), 
            description, 
            category, 
            sum, 
            date 
        })
        res.status(200).json(newCost)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router