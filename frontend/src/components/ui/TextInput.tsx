import { iTextInputProps } from "@/interfaces";
import { ChangeEvent, useEffect, useId, useState } from "react";

const TextInput = ({
  name,
  className = "",
  value,
  placeholder = "",
  onChange = () => {},
  disabled = false,
  isHidden = false,
  validation,
}: iTextInputProps) => {
  const id = useId();
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (!!validation && value !== "") setIsValid(validation.rule.test(value));
  }, [value]);

  return (
    <div
      className={[
        "input-container",
        className,
        disabled ? "input-disabled" : "",
        isValid ? "" : "not-valid",
      ].join(" ")}
    >
      <div className="input-content">
        <input
          type={!isHidden ? "text" : "password"}
          placeholder=" "
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e);
          }}
          disabled={disabled}
          id={id}
          name={name}
        />
        <label htmlFor={id}> {placeholder} </label>
      </div>
      {!!validation && !isValid && (
        <div className="input-validation-error">{validation.error}</div>
      )}
    </div>
  );
};

export default TextInput;
