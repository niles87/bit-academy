import React from "react";
import "./welcome.css";

export const Welcome = (props: any) => {
  return (
    <div className="welcome">
      <h1>Bit Academy</h1>
      {props.children}
      <h3>Byte sized learning</h3>
    </div>
  );
};
