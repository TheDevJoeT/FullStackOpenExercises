import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);

  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor, mutationResult] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (result.loading) return <div>loading...</div>;

  const authors = result.data?.allAuthors || [];

  const selectedName = name || (authors.length > 0 ? authors[0].name : "");

  const submit = (event) => {
    event.preventDefault();

    if (!selectedName || !born) return;

    editAuthor({
      variables: {
        name: selectedName,
        setBornTo: Number(born),
      },
    });

    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
          </tr>

          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          name
          <select
            value={selectedName}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit" disabled={!born}>
          update author
        </button>
      </form>

      {mutationResult.loading && <p>updating...</p>}
      {mutationResult.error && (
        <p style={{ color: "red" }}>error updating author</p>
      )}
    </div>
  );
};

export default Authors;
