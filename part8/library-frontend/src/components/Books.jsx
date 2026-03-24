import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = () => {
  const [genre, setGenre] = useState(null);

  const result = useQuery(ALL_BOOKS, {
    variables: {
      author: null,
      genre: genre,
    },
  });

  if (result.loading) {
    return <div>Books Loading ....</div>;
  }

  const books = result.data?.allBooks || [];
  const genres = [...new Set(books.flatMap((b) => b.genres || []))];

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}

        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
