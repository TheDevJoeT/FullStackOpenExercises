import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ListGroup, Container, Form, Button, Card } from "react-bootstrap";

import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Users from "./components/Users";
import User from "./components/User";
import BlogView from "./components/BlogView";
import NavBar from "./components/NavBar";

import {
  setNotification,
  clearNotification,
} from "./reducers/notificationReducer";

import {
  setBlogs,
  appendBlog,
  updateBlog,
  removeBlog,
} from "./reducers/blogReducer";

import { setUser, clearUser } from "./reducers/userReducer";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(storedUser));
      blogService.setToken(storedUser.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));

      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong username or password"));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    const returnedBlog = await blogService.create(blogObject);

    dispatch(appendBlog(returnedBlog));

    dispatch(setNotification(`a new blog ${returnedBlog.title} added`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);
  };

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);

    dispatch(
      updateBlog({
        ...returnedBlog,
        user: blog.user,
      }),
    );
  };

  const deleteBlog = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );

    if (!confirmDelete) return;

    await blogService.remove(blog.id);

    dispatch(removeBlog(blog.id));
  };

  return (
    <Router>
      <div>
        <Notification />

        {user === null ? (
          <div>
            <Container className="d-flex justify-content-center mt-5">
              <Card style={{ width: "25rem" }}>
                <Card.Body>
                  <Card.Title className="mb-4 text-center">
                    Log in to application
                  </Card.Title>

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        placeholder="Enter username"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        placeholder="Enter password"
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                      Login
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Container>
          </div>
        ) : (
          <div>
            <NavBar user={user} handleLogout={handleLogout} />

            <Routes>
              <Route
                path="/"
                element={
                  <Container className="mt-3">
                    <h2>blogs</h2>

                    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                      <BlogForm createBlog={addBlog} />
                    </Togglable>

                    <ListGroup className="mt-3">
                      {blogs
                        .slice()
                        .sort((a, b) => b.likes - a.likes)
                        .map((blog) => (
                          <ListGroup.Item
                            key={blog.id}
                            action
                            as={Link}
                            to={`/blogs/${blog.id}`}
                          >
                            {blog.title} {blog.author}
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </Container>
                }
              />

              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User />} />
              <Route path="/blogs/:id" element={<BlogView user={user} />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
