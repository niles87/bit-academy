import React, { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN } from "../../utils/mutations";
import { Welcome } from "../Welcome";
import Auth from "../../utils/auth";
import { StatusMsg } from "../StatusMsg";
import "./login.css";

interface UserData {
  email: string;
  password: string;
}

export const Login = () => {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  });
  const [login, { error }] = useMutation(LOGIN);
  const [statMsgShow, setStatMsgShow] = useState<boolean>(false);
  const [statMsgSuccess, setStatMsgSuccess] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  let navigate = useNavigate();
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

  const formSubmit = async (
    ev: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    ev.preventDefault();

    try {
      const { data } = await login({ variables: { ...userData } });
      Auth.login(data.login.token);
      if (Auth.getToken().length > 1) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      console.error(err.message);
      if (err) {
        setMsg("Something Went Wrong");
        setStatMsgShow(true);
      }
    }

    setUserData({ email: "", password: "" });
  };

  let valid: boolean | undefined;
  userData.email === "" && userData.password === ""
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
      <div className="login">
        <h3 id="login_form">Login</h3>
        <form onSubmit={formSubmit} aria-labelledby="login_form">
          <div>
            <label htmlFor="login_email">
              Email <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="email"
              name="email"
              id="login_email"
              onChange={handleInputChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            {/* need better contrast for labels */}
            <label htmlFor="login_password">
              Password <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              aria-required="true"
              required
            />
          </div>
          <button type="submit" disabled={valid} aria-disabled={valid}>
            Login
          </button>
        </form>
        <div>
          <p className="signup-link">
            New Teacher?{" "}
            <Link className="link" to="/register">
              <span>Sign up</span>
              <span className="sr-only">, page</span>
            </Link>{" "}
            here.
          </p>
        </div>
      </div>
    </Welcome>
  );
};
