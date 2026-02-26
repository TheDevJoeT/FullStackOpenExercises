const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const { describe } = require('node:test')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Joe',
      url: 'http://example.com',
      likes: 5,
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Joe',
      url: 'http://example.com',
      likes: 5,
    },
    {
      _id: '2',
      title: 'Second blog',
      author: 'Jane',
      url: 'http://example.com',
      likes: 7,
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Joe',
      url: 'http://example.com',
      likes: 3,
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has many blogs, returns total likes', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 15)
  })

  test('when list is empty, returns zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})