import { Routes, Route, Link, Navigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client/react";
import Recommend from "./components/Recommend";
import { useSubscription } from "@apollo/client/react";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );

  const client = useApolloClient();

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;

      alert(`New book added: ${addedBook.title}`);

      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { author: null, genre: null } },
        (existingData) => {
          if (!existingData) return;

          const alreadyExists = existingData.allBooks.some(
            (b) => b.id === addedBook.id,
          );

          if (alreadyExists) return existingData;

          return {
            allBooks: existingData.allBooks.concat(addedBook),
          };
        },
      );
    },
  });
  return (
    <div>
      <div>
        <Link to="/authors">
          <button>authors</button>
        </Link>
        <Link to="/books">
          <button>books</button>
        </Link>

        {!token && (
          <Link to="/login">
            <button>login</button>
          </Link>
        )}

        {token && (
          <>
            <Link to="/add">
              <button>add book</button>
            </Link>
            <button onClick={handleLogout}>logout</button>
          </>
        )}

        {token && (
          <Link to="/recommend">
            <button>recommend</button>
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Navigate replace to="/authors" />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route
          path="/add"
          element={token ? <NewBook /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route
          path="/recommend"
          element={token ? <Recommend /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
