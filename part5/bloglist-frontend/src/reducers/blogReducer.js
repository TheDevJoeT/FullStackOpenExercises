import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updated = action.payload;
      return state.map((b) => (b.id !== updated.id ? b : updated));
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions;

export default blogSlice.reducer;
