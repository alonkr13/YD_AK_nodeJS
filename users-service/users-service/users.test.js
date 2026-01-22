require('dotenv').config({ path: __dirname + '/.env' })
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('./app')
const User = require('./models/user.model')
const Cost = require('./models/cost.model')

jest.setTimeout(30000) // increase timeout for MongoDB operations

beforeAll(async () => {
    // Wait for the connection initiated by app.js to be ready
    if (mongoose.connection.readyState !== 1) {
        await new Promise(resolve => mongoose.connection.once('connected', resolve))
    }
    await User.deleteMany({})
    await Cost.deleteMany({})
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('Users Service', () => {
    const userData = {
        id: 123,
        first_name: 'John',
        last_name: 'Doe',
        birthday: '2000-01-01'
    }

    test('POST /api/add should add a new user', async () => {
        const res = await request(app)
            .post('/api/add')
            .send(userData)

        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBe(123)
    })

    test('GET /api/users/:id should return user with total costs', async () => {
        // Add some costs for this user
        await Cost.create([
            { userid: 123, description: 'milk', category: 'food', sum: 5 },
            { userid: 123, description: 'book', category: 'education', sum: 15 }
        ])

        const res = await request(app)
            .get('/api/users/123')

        expect(res.statusCode).toBe(200)
        expect(res.body.first_name).toBe('John')
        expect(res.body.total).toBe(20) // 5 + 15
    })

    test('GET /api/users should return all users', async () => {
        const res = await request(app)
            .get('/api/users')

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(1)
    })
})
