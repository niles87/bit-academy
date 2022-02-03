import React from "react";
import "./modal.css";

export const Modal = (props: any) => {
  const modalClass = props.show ? "modal active" : "modal hide";
  return (
    <div className={modalClass}>
      <div className="modal-main" role="dialog" aria-labelledby="modal_title">
        <div>
          <button className="modal-close" onClick={props.handleClose}>
            {" "}
            <span className="sr-only"> Close dialog</span>
          </button>
        </div>
        <h2 id="modal_title">{props.label}</h2>
        {props.children}
      </div>
    </div>
  );
};
