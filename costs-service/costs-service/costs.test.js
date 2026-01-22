const request = require('supertest')
const mongoose = require('mongoose')
const app = require('./app')
const Cost = require('./models/cost.model')

const TEST_USERID = 123124

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

afterEach(async () => {
    await Cost.deleteMany({ userid: TEST_USERID })
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('Costs Service', () => {

    test('POST /api/add adds cost item', async () => {
        const costData = {
            id: TEST_USERID,
            description: 'milk',
            category: 'food',
            sum: 8,
            date: '2026-01-10'
        }

        const res = await request(app).post('/api/add').send(costData)

        expect(res.statusCode).toBe(200)
        expect(res.body.userid).toBe(TEST_USERID)
        expect(res.body.description).toBe('milk')
        expect(res.body.category).toBe('food')
        expect(res.body.sum).toBe(8)
    })

    test('GET /api/report returns correct monthly report', async () => {
        const costData = [
            { userid: TEST_USERID, description: 'milk', category: 'food', sum: 8, date: '2026-01-10' },
            { userid: TEST_USERID, description: 'book', category: 'education', sum: 15, date: '2026-01-12' }
        ]

        await Cost.insertMany(costData)

        const res = await request(app).get('/api/report').query({ id: TEST_USERID, year: 2026, month: 1 })

        expect(res.statusCode).toBe(200)
        expect(res.body.report.food).toBe(8)
        expect(res.body.report.education).toBe(15)
        expect(res.body.report.health).toBe(0)
        expect(res.body.report.housing).toBe(0)
        expect(res.body.report.sport).toBe(0)
        expect(res.body.report.transportation).toBe(0)
        expect(res.body.report.other).toBe(0)
    })

})
