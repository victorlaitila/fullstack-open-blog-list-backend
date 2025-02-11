const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const testHelper = require('./testHelper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('user api', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await testHelper.createTestUser()
  })
  describe('creating user', () => {
    test('username below 3 characters results in error with status code 400', async () => {
      const user = {
        name: "Test",
        username: "A",
        password: "Password"
      }
      const errorResponse = await api
        .post('/api/users')
        .send(user)
        .expect(400)
      assert.strictEqual(errorResponse.body.error, 'User validation failed: username: username must have at least 3 characters')
      const response = await api.get('/api/users')
      assert.strictEqual(response.body.length, 1)
    })
    test('password below 3 characters results in error with status code 400', async () => {
      const user = {
        name: "Test",
        username: "Username",
        password: "A"
      }
      const errorResponse = await api
        .post('/api/users')
        .send(user)
        .expect(400)
      assert.strictEqual(errorResponse.body.error, 'password must have at least 3 characters')
      const response = await api.get('/api/users')
      assert.strictEqual(response.body.length, 1)
    })
    test('username must be unique', async () => {
      const user = {
        name: "Test",
        username: "user",
        password: "Password"
      }
      const errorResponse = await api
        .post('/api/users')
        .send(user)
        .expect(400)
      assert.strictEqual(errorResponse.body.error, 'expected `username` to be unique')
      const response = await api.get('/api/users')
      assert.strictEqual(response.body.length, 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})