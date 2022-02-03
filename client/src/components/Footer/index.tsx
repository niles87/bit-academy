import React from "react";
import "./footer.css";

export const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {date} Bit Academy</p>
      <a href="https://github.com/niles87/bit-academy">
        github <span className="sr-only">, repository for application</span>
      </a>
    </footer>
  );
};
