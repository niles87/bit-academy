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
        navigate('/dashboard', {replace: true});
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
          <button type="submit" disabled={valid}>
            Login
          </button>
        </form>
        <div>
          <p className="signup-link">
            New Teacher?{" "}
            <Link className="link" to="/register">
              <span>Sign up</span>
            </Link>{" "}
            here.
          </p>
        </div>
      </div>
    </Welcome>
  );
};
