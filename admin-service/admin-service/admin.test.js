require('dotenv').config()
const request = require('supertest')
const app = require('./app')

describe('Admin Service', () => {

    test('GET /api/about should return devs from .env', async () => {
        const res = await request(app).get('/api/about')

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(2)
        expect(res.body[0].first_name).toBe(process.env.DEV1_FIRST_NAME)
        expect(res.body[0].last_name).toBe(process.env.DEV1_LAST_NAME)
        expect(res.body[1].first_name).toBe(process.env.DEV2_FIRST_NAME)
        expect(res.body[1].last_name).toBe(process.env.DEV2_LAST_NAME)
    })
})