const bcrypt = require('bcrypt')
const User = require('../models/user')

const testUserName = 'user'
const testPassword = 'password'

const createTestUser = async () => {
  const passwordHash = await bcrypt.hash(testPassword, 10)
  const user = new User({ username: testUserName, passwordHash })
  await user.save()
  return user
}

module.exports = {
  createTestUser
}