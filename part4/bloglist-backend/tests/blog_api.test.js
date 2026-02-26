const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("node:assert");
const helper = require('./test_helper')

const api = supertest(app);

const initialBlogs = [
  {
    title: "First test blog",
    author: "Joe",
    url: "http://example.com/1",
    likes: 5,
  },
  {
    title: "Second test blog",
    author: "Jane",
    url: "http://example.com/2",
    likes: 7,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);
  assert(titles.includes("First test blog"));
});

// Test methods for POST requests

test('a valid blog can be added', async () => {
    const newBlog = {title: 'Async makes backend cleaner',
    author: 'Joe',
    url: 'http://example.com/async',
    likes: 10,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('Async makes backend cleaner'))
})

test('a blog without title is not added', async () => {
    const newBlog = {
    author: 'Joe',
    url: 'http://example.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

// GET by id tests

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView.toJSON())
})

test('returns 404 for non-existing blog id', async () => {
  const validNonExistingId = new mongoose.Types.ObjectId().toString()

  await api
    .get(`/api/blogs/${validNonExistingId}`)
    .expect(404)
})

test('returns 400 for malformed blog id', async () => {
  const malformedId = '123invalidid'

  await api
    .get(`/api/blogs/${malformedId}`)
    .expect(400)
})

// DELETE TESTS
test('a blog can be deleted', async () => {
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

after(async () => {
  await mongoose.connection.close();
});
