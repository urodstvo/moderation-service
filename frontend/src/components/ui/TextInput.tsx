import { iTextInputProps } from "@/interfaces";
import { ChangeEvent, memo, useEffect, useId, useState } from "react";

const TextInput = memo(({
    className = '',
    value, 
    placeholder = '', 
    onChange = () => {}, 
    disabled = false, 
    isHidden = false,
    validation
} : iTextInputProps) => {
    const id = useId();
    const [isValid, setIsValid] = useState<boolean>(true);
   
    let debouncedValidate = () => {};
    // if (validation) debouncedValidate = debounce(() => {setIsValid(validation.rule.test(value))}, 1000);

    useEffect(() => {if (!!validation) setIsValid(validation.rule.test(value))}, [value])

    return (
        <div className ={["input-container", className, disabled ? "input-disabled" : ''].join(' ')}>
            <div className="input-content">
                <input
                    type={!isHidden ? "text" : "password"} 
                    placeholder=" " 
                    value={value} 
                    onChange={(e : ChangeEvent<HTMLInputElement>) => {onChange(e); debouncedValidate()}}
                    disabled={disabled} 
                    id={id}
                />
                <label htmlFor={id}> {placeholder} </label>
            </div>
            {!!validation && !isValid && <div className="input-validation-error">{validation.error}</div>}
        </div>
    );
});

export default TextInput;