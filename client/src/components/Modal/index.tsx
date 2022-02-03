import React from "react";
import "./modal.css";

export const Modal = (props: any) => {
  const modalClass = props.show ? "modal active" : "modal hide";
  return (
    <div className={modalClass}>
      <div className="modal-main" role="dialog" aria-label={props.label}>
        <div>
          <button className="modal-close">
            {" "}
            <span className="sr-only"> Close dialog</span>
          </button>
        </div>
        {props.children}
        <button className="cancel" onClick={props.handleClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
