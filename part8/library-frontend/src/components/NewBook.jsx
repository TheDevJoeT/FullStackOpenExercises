import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook, result] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      {
        query: ALL_BOOKS,
        variables: { author: null, genre: null },
      },
    ],
    onError: (error) => {
      console.error(error.message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    if (!title || !author || !published) return;

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    if (!genre.trim()) return;
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <h2>add book</h2>

      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          published
          <input
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button type="button" onClick={addGenre}>
            add genre
          </button>
        </div>

        <div>genres: {genres.join(" ")}</div>

        <button type="submit">create book</button>
      </form>

      {result.loading && <p>adding book...</p>}
      {result.error && <p style={{ color: "red" }}>error adding book</p>}
    </div>
  );
};

export default NewBook;
