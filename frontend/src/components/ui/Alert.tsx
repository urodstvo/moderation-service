import { useState } from "react";
import { createPortal } from "react-dom";

interface iAlertProps{
    text: string, 
    seconds?: number
}

const Alert = ({text} : iAlertProps) => {
    const [show, setShow] = useState<boolean>(true);
    setTimeout(() => setShow(false), 3000)

    if (show) return (
        <div className="alert-container">
            <div className="alert-content">{text}</div>
            <div className="alert-timer"></div>
        </div>
    )
    else return null
};

export const showAlert = (text: string, seconds: number = 3) => {
    return createPortal(<Alert text={text} />, document.getElementById("root") as HTMLDivElement);
}

export default Alert;