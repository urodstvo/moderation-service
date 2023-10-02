import { iTextInputProps } from "@/interfaces";

const TextInput = ({placeholder = '', disabled = false, value, onChange} : iTextInputProps) => {
    return (
        <div className="input-container">
            <div className="input-content">
                <input type="text" placeholder=" " value={value} onChange={onChange} disabled={disabled}/>
                <div className="input-placeholder" placeholder={placeholder} />
            </div>
        </div>
    );
};

export default TextInput;