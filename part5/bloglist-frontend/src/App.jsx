import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Login failed:', exception)
      setErrorMessage('wrong username or password')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const returnedBlog = await blogService.create(blogObject)

    setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog))

    setMessage(`a new blog ${returnedBlog.title} added`)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs((prevBlogs) =>
      prevBlogs.map((b) =>
        b.id !== blog.id ? b : { ...returnedBlog, user: blog.user },
      ),
    )
  }

  const deleteBlog = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    )

    if (!confirmDelete) return

    await blogService.remove(blog.id)

    setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id))
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message || errorMessage} />
        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>

          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={message || errorMessage} />
      <p>{user.name} logged in</p>

      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h2>blogs</h2>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App