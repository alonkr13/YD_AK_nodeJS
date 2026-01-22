require('dotenv').config()

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('./app')
const Log = require('./models/log.model')

let mongoClient

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
    mongoClient = await app.dbReady
})

beforeEach(async () => {
    await Log.deleteMany({})
})

afterEach(async () => {
    await Log.deleteMany({})
})

afterAll(async () => {
    await mongoose.connection.close()
    if (mongoClient) await mongoClient.close()
})

describe('Logs Service', () => {
    test('GET /api/logs returns all logs', async () => {

        await Log.create({
            message: 'Test log message',
            level: 'info',
            service: 'logs-service'
        })

        const res = await request(app).get('/api/logs')

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(1)
        expect(res.body[0].message).toBe('Test log message')
    })
})
