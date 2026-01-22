const express = require('express')
const router = express.Router()
const User = require('./models/user.model')
const Cost = require('../costs-service/models/cost.model') // import your Cost model

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id)
        const user = await User.findOne({ id: userId })

        if (!user) return res.status(404).json({ message: 'User not found' })

        // Calculate total costs for this user
        const costs = await Cost.find({ userid: userId })
        const total = costs.reduce((sum, item) => sum + item.sum, 0)

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: total
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
