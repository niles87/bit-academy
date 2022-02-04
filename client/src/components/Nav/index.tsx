import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../../utils/auth";
import "./nav.css";

export const Nav = () => {
  let nav = useNavigate();
  return (
    <nav aria-label="Main">
      <ul>
        <li>
          <Link className="navLink" to="/dashboard">
            Home
          </Link>
          |
        </li>
        <li>
          <Link className="navLink" to="/dashboard/assignments">
            Assignments
          </Link>
          |
        </li>
        <li>
          <a
            className="navLink"
            href="/"
            onClick={() => {
              Auth.logout();
              nav("/", { replace: true });
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};
