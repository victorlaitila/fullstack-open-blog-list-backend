const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const blogData = require('./blogData.json')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('blog api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = blogData.blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  
  test('returns correct number of blog posts in json format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, blogData.blogs.length)
  })
  
  test('unique identifier for blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      const keys = Object.keys(blog)
      assert(keys.includes('id'))
      assert(!keys.includes('_id'))
    })
  })
  
  test('new blog post is created successfully', async () => {
    const newBlogPost = {
      title: 'New Blog',
      author: 'New Author',
      url: 'newblog.com',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('New Blog'))
    assert.strictEqual(response.body.length, blogData.blogs.length + 1)
  })
  
  test('creating new blog post without likes defaults number of likes to 0', async () => {
    const newBlogPost = {
      title: 'Blog Without Likes',
      author: 'Test Author',
      url: 'nolikes.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const addedPost = response.body.find(blog => blog.title === 'Blog Without Likes')
    assert.strictEqual(addedPost.likes, 0)
  })
  
  test('if title is missing from new blog post, backend responds with status code 400', async () => {
    const newBlogPost = {
      author: 'Test Author',
      url: 'notitle.com',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(400)
  })
  
  test('if url is missing from new blog post, backend responds with status code 400', async () => {
    const newBlogPost = {
      title: 'Test Title',
      author: 'Test Author',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(400)
  })

  describe('deleting blog posts', () => {
    test('successful deletion of existing blog post', async () => {
      const blog = blogData.blogs[0]
      await api
        .delete(`/api/blogs/${blog._id}`)
        .expect(204)
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, blogData.blogs.length - 1)
      const titles = response.body.map(blog => blog.title)
      assert(!titles.includes(blog.title))
    })

    test('deleting by malformatted id responds with status code 400', async () => {
      const errorResponse = await api
        .delete('/api/blogs/1234abcd')
        .expect(400)
      assert.strictEqual(errorResponse.body.error, 'malformatted id')
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, blogData.blogs.length)
    })
  })

  describe('modifying blog posts', () => {
    test('successful modification of existing blog post', async () => {
      const blog = blogData.blogs[0]
      const newBlogPost = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'updated.com',
        likes: 0
      }
      await api
        .put(`/api/blogs/${blog._id}`)
        .send(newBlogPost)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, blogData.blogs.length)
      const titles = response.body.map(blog => blog.title)
      assert(titles.includes('Updated Title'))
    })

    test('modifying by malformatted id responds with status code 400', async () => {
      const newBlogPost = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'updated.com',
        likes: 0
      }
      const errorResponse = await api
        .put('/api/blogs/1234abcd')
        .send(newBlogPost)
        .expect(400)
      assert.strictEqual(errorResponse.body.error, 'malformatted id')
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, blogData.blogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})