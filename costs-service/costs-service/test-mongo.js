require('dotenv').config()
const mongoose = require('mongoose')

console.log('Testing MongoDB connection...')
console.log('URI:', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@')) // Hide password

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000 // 10 second timeout
})
.then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB')
    process.exit(0)
})
.catch(err => {
    console.error('❌ FAILED! Error details:')
    console.error('Message:', err.message)
    console.error('Code:', err.code)
    console.error('Codename:', err.codeName)
    process.exit(1)
})
