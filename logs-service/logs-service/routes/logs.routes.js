const express = require('express')
const Log = require('../models/log.model')

const router = express.Router()

router.get('/logs', async (req, res) => {
    const logs = await Log.find({})
    res.status(200).json(logs)
})

module.exports = router
