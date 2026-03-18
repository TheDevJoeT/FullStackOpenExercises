import { useState } from "react";

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  console.log("Blog Object", blog);
  console.log("Logged user", user);
  const isOwner = blog.user?.username === user?.username;

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>

          <div>{blog.user?.name}</div>

          {isOwner && <button onClick={() => deleteBlog(blog)}>remove</button>}
        </div>
      )}
    </div>
  );
};

export default Blog;
