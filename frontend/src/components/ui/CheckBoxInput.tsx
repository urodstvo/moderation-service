import { iCheckBoxProps } from "@/interfaces";

const CheckBoxInput = ({checked = false, onChange} : iCheckBoxProps) => {
    return (
    <div className="checkbox-container">
        <div className="checkbox-content">    
            <input type='checkbox' onChange={onChange} defaultChecked={checked}/>
            <div className="checkbox-mark" ></div>
        </div>
    </div>
    );
};

export default CheckBoxInput;