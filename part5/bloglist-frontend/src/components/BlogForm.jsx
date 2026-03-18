import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>

      <Form onSubmit={addBlog}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Enter blog title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Enter author name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="https://example.com"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm