import React from "react";
import "./welcome.css";

export const Welcome = (props: any) => {
  return (
    <main className="welcome">
      <h1>Bit Academy</h1>
      <h2>Byte sized learning</h2>
      {props.children}
    </main>
  );
};
