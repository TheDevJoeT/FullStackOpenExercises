import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders title and author but not url or likes by default", () => {
  const blog = {
    title: "React Testing",
    author: "Kent C Dodds",
    url: "http://reacttesting.com",
    likes: 10,
    user: {
      username: "tester",
      name: "Test User",
    },
  };

  render(<Blog blog={blog} />);

  expect(screen.getByText("React Testing Kent C Dodds")).toBeDefined();
  expect(screen.queryByText("http://reacttesting.com")).toBeNull();
  expect(screen.queryByText("likes 10")).toBeNull();
});

test("shows url and likes when view button is clicked", async () => {
  const blog = {
    title: "React Testing",
    author: "Kent C Dodds",
    url: "http://reacttesting.com",
    likes: 10,
    user: {
      username: "tester",
      name: "Test User",
    },
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");

  await user.click(button);

  expect(screen.getByText("http://reacttesting.com")).toBeDefined();
  expect(screen.getByText("likes 10")).toBeDefined();
});

test("clicking like button twice calls event handler twice", async () => {
  const blog = {
    title: "React Testing",
    author: "Kent C Dodds",
    url: "http://reacttesting.com",
    likes: 10,
    user: {
      username: "tester",
      name: "Test User",
    },
  };

  const mockLikeHandler = vi.fn();

  render(<Blog blog={blog} likeBlog={mockLikeHandler} />);

  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");

  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockLikeHandler).toHaveBeenCalledTimes(2);
});
