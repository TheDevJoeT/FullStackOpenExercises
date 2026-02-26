const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('fetching blogs', () => {

    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)
      assert(titles.includes(helper.initialBlogs[0].title))
    })
  })

  describe('viewing a specific blog', () => {

    test('succeeds with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is malformed', async () => {
      const malformedId = '123invalidid'

      await api
        .get(`/api/blogs/${malformedId}`)
        .expect(400)
    })
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
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes(newBlog.title))
    })

    test('defaults likes to 0 if missing', async () => {
      const newBlog = {
        title: 'No likes blog',
        author: 'Joe',
        url: 'http://example.com/nolikes'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd.find(b => b.title === 'No likes blog')

      assert.strictEqual(savedBlog.likes, 0)
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'Joe',
        url: 'http://example.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'Missing URL',
        author: 'Joe',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)

      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length - 1
      )
    })
  })
})

describe('updating a blog', () => {

  test('succeeds in updating likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const resultBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(resultBlog.likes, blogToUpdate.likes + 1)
  })

})

after(async () => {
  await mongoose.connection.close()
})