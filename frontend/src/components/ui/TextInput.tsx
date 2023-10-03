import { iTextInputProps } from "@/interfaces";

const TextInput = ({placeholder = '', disabled = false, value = '', onChange, className = ''} : iTextInputProps) => {
    return (
        <div className ={["input-container", className, disabled ? "input-disabled" : ''].join(' ')}>
            <div className="input-content">
                <input type="text" placeholder=" " value={value} onChange={onChange} disabled={disabled}/>
                <div className="input-placeholder" placeholder={placeholder} />
            </div>
        </div>
    );
};

export default TextInput;