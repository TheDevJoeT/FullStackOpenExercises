import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username,
      password
    })

    window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(user)
    )

    blogService.setToken(user.token)
    setUser(user)

    setUsername('')
    setPassword('')
  } catch (exception) {

    setErrorMessage('wrong username or password')

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    const blogObject = {
      title,
      author,
      url,
    };

    const returnedBlog = await blogService.create(blogObject);

    setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))

    setMessage(`a new blog ${returnedBlog.title} added`);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  if (user === null) {
    return (
      <div>
        <Notification message={message || errorMessage} />
        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Notification message={message || errorMessage} />
      <p>{user.name} logged in</p>

      <button onClick={handleLogout}>logout</button>

      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          url:
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>

        <button type="submit">create</button>
      </form>

      <h2>blogs</h2>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
