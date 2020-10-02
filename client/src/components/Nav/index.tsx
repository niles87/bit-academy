import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import "./nav.css";

export const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link className="navLink" to="/home">
            Home
          </Link>
          |
        </li>
        <li>
          <Link className="navLink" to="/assignments">
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
              window.location.assign("/");
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};
