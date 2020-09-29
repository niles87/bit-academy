import React, { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import "./login.css";

export const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN);

  if (error) console.error(error);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setUserData({ ...userData, [name]: value });
  };

  const formSubmit = async (ev: ChangeEvent<HTMLFormElement>) => {
    ev.preventDefault();

    try {
      const { data } = await login({ variables: { ...userData } });
      Auth.login(data.login.token);
      if (Auth.getToken().length > 1) {
        window.location.assign("/home");
      }
    } catch (err) {
      console.error(err);
    }

    setUserData({ email: "", password: "" });
  };

  return (
    <div className="login">
      <h3>Login</h3>
      <form onSubmit={formSubmit}>
        <div>
          <input
            type="email"
            name="email"
            onChange={handleInputChange}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            onChange={handleInputChange}
            placeholder="Password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          New Teacher?{" "}
          <Link className="link" to="/register">
            <span>Sign up</span>
          </Link>{" "}
          here.
        </p>
      </div>
    </div>
  );
};
