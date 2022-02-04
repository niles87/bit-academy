import React, { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { ADD_TEACHER } from "../../utils/mutations";
import { Welcome } from "../Welcome";
import Auth from "../../utils/auth";
import { StatusMsg } from "../StatusMsg";
import "./register.css";

interface UserData {
  username: string;
  password: string;
  email: string;
}

export const Register = () => {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    email: "",
  });
  const [addTeacher, { error }] = useMutation(ADD_TEACHER);
  const [statMsgShow, setStatMsgShow] = useState<boolean>(false);
  const [statMsgSuccess, setStatMsgSuccess] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  if (error) console.error(error);

  const closeStatusMsg = (): void => {
    setStatMsgShow(false);
    setStatMsgSuccess(false);
    setMsg("");
  };

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = ev.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = async (
    ev: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    ev.preventDefault();

    try {
      const { data } = await addTeacher({ variables: { ...userData } });
      Auth.login(data.addTeacher.token);
      if (data) {
        setMsg("Registered Successfully");
        setStatMsgShow(true);
      }
    } catch (err: any) {
      console.error(err.message);
      if (err) {
        setMsg("Something Went Wrong");
        setStatMsgShow(true);
      }
    }
  };
  let valid: boolean | undefined;
  userData.email === "" && userData.password === "" && userData.username === ""
    ? (valid = true)
    : (valid = false);

  if (statMsgShow) {
    setTimeout(closeStatusMsg, 6000);
  }

  return (
    <Welcome>
      <StatusMsg
        show={statMsgShow}
        success={statMsgSuccess}
        msg={msg}
        handleClose={closeStatusMsg}
      />
      <div className="register">
        <h3 id="register_form">Register</h3>
        <form onSubmit={handleFormSubmit} aria-labelledby="register_form">
          <div>
            <label htmlFor="username">
              Username <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleInputChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="email">
              Email <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="password">
              Password <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleInputChange}
              aria-required="true"
              required
            />
          </div>
          <button type="submit" disabled={valid} aria-disabled={valid}>
            Register
          </button>
        </form>
        <div>
          <p className="signup-link">
            Already registered?{" "}
            <Link className="link" to="/">
              <span>Log in</span>
              <span className="sr-only">, page</span>
            </Link>{" "}
            here.
          </p>
        </div>
      </div>
    </Welcome>
  );
};
