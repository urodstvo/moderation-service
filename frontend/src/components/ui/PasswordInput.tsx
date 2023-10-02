import { iPasswordInputProps } from "@/interfaces";

const PasswordInput = ({placeholder = '', disabled = false, isShown = false, value, onChange} : iPasswordInputProps) => {
    return (
        <div className="input-container" >
            <div className="input-content">
                <input type={isShown ? "text" : "password"} placeholder=" " value={value} onChange={onChange} disabled={disabled}/>
                <div className="input-placeholder" placeholder={placeholder} />
            </div>
        </div>
    );
};

export default PasswordInput;