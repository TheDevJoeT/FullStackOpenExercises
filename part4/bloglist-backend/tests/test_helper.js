const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First test blog',
    author: 'Joe',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second test blog',
    author: 'Jane',
    url: 'http://example.com/2',
    likes: 7
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'will be deleted',
    author: 'temp',
    url: 'temp',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb
}