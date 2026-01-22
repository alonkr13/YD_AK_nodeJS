require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.MONGO_URI)

app.listen(3002, () => {
    console.log('Logs service running on port 3002')
})
