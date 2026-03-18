import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateBlog, removeBlog } from "../reducers/blogReducer";
import blogService from "../services/blogs";

const BlogView = ({ user }) => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  const handleLike = async () => {
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );

    if (!confirmDelete) return;

    await blogService.remove(blog.id);
    dispatch(removeBlog(blog.id));
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!comment.trim()) return;

    const updatedBlog = await blogService.addComment(blog.id, comment);

    dispatch(updateBlog(updatedBlog));

    setComment("");
  };

  const isOwner = blog.user?.username === user?.username;

  return (
    <div>
      <h2>{blog.title}</h2>

      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div>
        likes {blog.likes}
        <button onClick={handleLike}>like</button>
      </div>

      <div>added by {blog.user?.name}</div>

      {isOwner && <button onClick={handleDelete}>remove</button>}

      <h3>comments</h3>

      <form onSubmit={handleAddComment}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {(blog.comments || []).map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogView;
