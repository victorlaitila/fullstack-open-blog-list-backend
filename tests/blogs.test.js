const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/listHelper')
const blogData = require('./blogData.json')

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list only has one blog, equals the amount of likes for that blog', () => {
    const listWithOneBlog = [blogData.blogs[0]] 
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 7)
  })

  test('of multiple blogs are calculated correctly', () => {
    const result = listHelper.totalLikes(blogData.blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('is null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, null)
  })

  test('is calculated correctly', () => {
    const blogWithMostLikes = blogData.blogs[2]
    const result = listHelper.favoriteBlog(blogData.blogs)
    assert.deepStrictEqual(result, blogWithMostLikes)
  })
})

describe('author with most blogs', () => {
  test('is null for empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, null)
  })
  test('is calculated correctly', () => {
    const exampleResult = {
      author: "Robert C. Martin",
      blogs: 3
    }
    const result = listHelper.mostBlogs(blogData.blogs)
    assert.deepStrictEqual(result, exampleResult)
  })
})

describe('author with most likes', () => {
  test('is null for empty list', () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, null)
  })
  test('is calculated correctly', () => {
    const exampleResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    const result = listHelper.mostLikes(blogData.blogs)
    assert.deepStrictEqual(result, exampleResult)
  })
})