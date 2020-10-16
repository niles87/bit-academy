import React from "react";
import "./statusMsg.css";

interface snacks {
  show: boolean;
  success: boolean;
  msg: string;
  handleClose: handleCloseFunc;
}
interface handleCloseFunc {
  (): void;
}

export const StatusMsg = (props: snacks) => {
  const statusShow: string = props.show
    ? "status-msg active-msg"
    : "status-msg hide-msg";
  const statusMsgClass: string = props.success ? "success" : "error";
  return (
    <div
      className={statusShow + " " + statusMsgClass}
      onClick={props.handleClose}
    >
      <p>{props.msg}</p>
    </div>
  );
};
