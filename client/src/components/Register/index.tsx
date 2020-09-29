import React, { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ADD_TEACHER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import "./register.css";

export const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [addTeacher, { error }] = useMutation(ADD_TEACHER);

  if (error) console.error(error);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = async (ev: ChangeEvent<HTMLFormElement>) => {
    ev.preventDefault();

    try {
      const { data } = await addTeacher({ variables: { ...userData } });
      Auth.login(data.addTeacher.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="register">
      <h3>Register</h3>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input
            type="text"
            name="username"
            onChange={handleInputChange}
            placeholder="username"
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      <div>
        <p>
          Already registered?{" "}
          <Link className="link" to="/">
            <span>Log in</span>
          </Link>{" "}
          here.
        </p>
      </div>
    </div>
  );
};
