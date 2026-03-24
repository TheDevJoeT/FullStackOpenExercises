import { useQuery, useApolloClient } from "@apollo/client/react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import { ALL_PERSONS } from "./queries";
import Notify from "./components/Notify";
import { useState } from "react";
import PhoneForm from "./components/PhoneForm";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("phonebook-user-token"),
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_PERSONS);
  const client = useApolloClient();

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  }

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={onLogout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  );
};

export default App;
