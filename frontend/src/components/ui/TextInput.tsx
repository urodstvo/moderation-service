import { iTextInputProps } from "@/interfaces";
import { useId } from "react";

const TextInput = ({
    className = '',
    value, 
    placeholder = '', 
    onChange, 
    disabled = false, 
    isHidden = false
} : iTextInputProps) => {
    const id = useId();
    return (
        <div className ={["input-container", className, disabled ? "input-disabled" : ''].join(' ')}>
            <div className="input-content">
                <input
                    type={!isHidden ? "text" : "password"} 
                    placeholder=" " 
                    value={value} 
                    onChange={onChange} 
                    disabled={disabled} 
                    id={id}
                />
                <label htmlFor={id}> {placeholder} </label>
            </div>
        </div>
    );
};

export default TextInput;