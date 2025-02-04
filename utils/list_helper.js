const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sum = (total, next) => {
    return total + next
  }
  return blogs.map(b => b.likes).reduce(sum, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const compareLikes = (currentFavorite, next) => {
    return next.likes > currentFavorite.likes ? next : currentFavorite
  }
  return blogs.reduce(compareLikes)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsByAuthors = _.groupBy(blogs, 'author')
  const maxAuthor = _.maxBy(Object.keys(blogsByAuthors), author => blogsByAuthors[author].length)
  return {
    author: maxAuthor,
    blogs: blogsByAuthors[maxAuthor].length
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const likesByAuthor = _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({ 
      author, 
      likes: _.sumBy(blogs, 'likes')
    }))
    .value()
  return _.maxBy(likesByAuthor, 'likes')
};

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog,
  mostBlogs,
  mostLikes
}