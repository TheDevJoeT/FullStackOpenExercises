import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("phonebook-user-token", token);
    },
    onError: (error) => {
      console.log("LOGIN ERROR:", error);

      setError(error.graphQLErrors?.[0]?.message || "Login failed");
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    console.log("Submitting login:", username, password);

    try {
      await login({ variables: { username, password } });
    } catch (e) {
      console.log("Caught error:", e);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
