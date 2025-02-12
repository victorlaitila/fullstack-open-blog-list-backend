const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user.id
  })
  const result = await newBlog.save()
  const populatedResult = await result.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(populatedResult._id)
  await user.save()
  response.status(201).json(populatedResult)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (user.id.toString() === blog.user.toString()) {
    await Blog.deleteOne(blog)
    response.status(204).end()
  } else {
    response.status(403).json({ error: 'user not authorized to delete blog post' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id
  }
  const updatedBlogPost = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  const populated = await updatedBlogPost.populate('user', { username: 1, name: 1 })
  response.json(populated)
})

module.exports = blogsRouter