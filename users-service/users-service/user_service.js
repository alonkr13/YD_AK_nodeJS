require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

// GET all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, __v: 0 })
        res.json(users)
    } catch (err) {
        res.status(500).json({ id: 0, message: err.message })
    }
})

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: Number(req.params.id) })
        if (!user) return res.status(404).json({ id: 0, message: 'User not found' })


        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        })
    } catch (err) {
        res.status(500).json({ id: 0, message: err.message })
    }
})

// POST add new user
app.post('/api/add', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday } = req.body
        const newUser = new User({ id, first_name, last_name, birthday })
        await newUser.save()
        res.json({ id, first_name, last_name, birthday })
    } catch (err) {
        res.status(500).json({ id: 0, message: err.message })
    }
})

module.exports = app
