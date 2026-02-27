const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {

  let token
  let testUser

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    
    const passwordHash = await bcrypt.hash('sekret', 10)
    testUser = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash
    })

    await testUser.save()

    
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = loginResponse.body.token

    
    const blogObjects = helper.initialBlogs.map(blog =>
      new Blog({ ...blog, user: testUser._id })
    )

    const savedBlogs = await Blog.insertMany(blogObjects)

    
    testUser.blogs = savedBlogs.map(b => b._id)
    await testUser.save()
  })

  describe('addition of a new blog', () => {

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Async makes backend cleaner',
        author: 'Joe',
        url: 'http://example.com/async',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )
    })

    test('fails with 401 if token not provided', async () => {
      const newBlog = {
        title: 'No token blog',
        author: 'Joe',
        url: 'http://example.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('deletion of a blog', () => {

    test('succeeds with status code 204 if id is valid and token provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length - 1
      )
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})