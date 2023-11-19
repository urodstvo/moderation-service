import { ReactNode } from "react";

const Modal = ({ children }: { children: ReactNode }) => {
  return (
    <div className="modal-container" onMouseDown={() => history.back()}>
      <div className="modal-close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
