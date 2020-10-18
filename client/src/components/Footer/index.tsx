import React from "react";
import "./footer.css";

export const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <div className="footer">
      <p>&copy; {date} Bit Academy</p>
      <a href="https://github.com/niles87/bit-academy">github</a>
    </div>
  );
};
