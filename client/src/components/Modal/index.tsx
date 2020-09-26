import React from "react";

export const Modal = (props: any) => {
  const modalClass = props.show ? "modal active" : "modal hide";
  return (
    <div className={modalClass}>
      <div className="modal-main">
        {props.children}
        <button className="cancel" onClick={props.handleClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
