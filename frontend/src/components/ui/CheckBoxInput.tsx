import { iCheckBoxProps } from "@/interfaces";

const CheckBoxInput = ({
    checked = false, 
    disabled = false, 
    onChange
} : iCheckBoxProps) => {
    return (
    <div className={["checkbox-container", disabled ? "input-disabled" : ''].join(' ')}>
        <div className="checkbox-content">    
            <input type='checkbox' 
                onChange={onChange} 
                defaultChecked={checked} 
                disabled={disabled}
            />
            <div className="checkbox-mark" />
        </div>
    </div>
    );
};

export default CheckBoxInput;