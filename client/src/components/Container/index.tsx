import React from "react";
import "./container.css";

export const Container = (props: any) => (
  <div className="container">{props.children}</div>
);
