import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("creating a blog calls the event handler with correct details", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole("textbox");
  const createButton = screen.getByText("create");

  await user.type(inputs[0], "Testing React");
  await user.type(inputs[1], "Kent C Dodds");
  await user.type(inputs[2], "http://reacttesting.com");

  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Testing React",
    author: "Kent C Dodds",
    url: "http://reacttesting.com",
  });
});
