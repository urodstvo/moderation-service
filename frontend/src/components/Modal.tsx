import { MouseEventHandler, ReactNode, useRef } from "react";

const Modal = ({children} : {children: ReactNode}) => {
    const container = useRef<HTMLDivElement>(null);
    const close = useRef<HTMLDivElement>(null);

    const back : MouseEventHandler = (e) => {
        if (e.target === container.current as HTMLDivElement || e.currentTarget === close.current)
        history.back()
    }

    return (
        <div className="modal-container" onMouseDown={back} ref={container}>
            <div className="modal-close" onMouseDown={back} ref={close}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </div>
            <div className="modal-content" >
                {children}
            </div>
        </div>
    );
};

export default Modal;