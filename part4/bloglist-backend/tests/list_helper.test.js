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


describe('favorite blog', () => {
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
      likes: 12,
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Joe',
      url: 'http://example.com',
      likes: 7,
    }
  ]

  test('returns null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)

    assert.deepStrictEqual(result, {
      title: 'Second blog',
      author: 'Jane',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Robert C. Martin',
      url: 'http://example.com',
      likes: 5,
    },
    {
      _id: '2',
      title: 'Second blog',
      author: 'Robert C. Martin',
      url: 'http://example.com',
      likes: 7,
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com',
      likes: 10,
    },
    {
      _id: '4',
      title: 'Fourth blog',
      author: 'Robert C. Martin',
      url: 'http://example.com',
      likes: 3,
    }
  ]

  test('returns null for empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Robert C. Martin',
      url: 'http://example.com',
      likes: 5,
    },
    {
      _id: '2',
      title: 'Second blog',
      author: 'Robert C. Martin',
      url: 'http://example.com',
      likes: 7,
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com',
      likes: 10,
    },
    {
      _id: '4',
      title: 'Fourth blog',
      author: 'Robert C. Martin',
      url: 'http://example.com',
      likes: 3,
    }
  ]

  test('returns null for empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('returns the author whose blogs have most total likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      likes: 15
    })
  })
})