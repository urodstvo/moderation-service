import { ColorVariant } from "@/interfaces";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { FormEvent, useState } from "react";
import { useTextInputProps } from "@/hooks";
import CheckBoxInput from "@/components/ui/CheckBoxInput";
import { useLoginMutation } from "@/api/authAPI";

import styles from "./AuthForm.module.css";

export const SignInForm = () => {
  const [signin, { isLoading, isSuccess, isError }] = useLoginMutation();

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const username = useTextInputProps({
    placeholder: "USERNAME",
    validation: {
      rule: /^[a-zA-Z0-9]{8,}$/,
      error:
        "Wrong username. Username must contain at least 8 symbols [a-Z][0-9]",
    },
  });
  const password = useTextInputProps({
    placeholder: "PASSWORD",
    isHidden: hidePassword,
    validation: {
      rule: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_-])(?=\S+$).{8,}$/,
      error:
        "Wrong Password. Must contain at least 8 symbols ([a-Z], at least 1 digit and spec symbol)",
    },
  });

  const hidePasswordHandler = () => {
    setHidePassword((prev) => !prev);
  };

  const signInHandler = async (e: FormEvent) => {
    e.preventDefault();
    await signin({ login: username.value, password: password.value });
  };

  return (
    <>
      <TextInput {...username} validation={undefined} key="username" />
      <TextInput {...password} validation={undefined} key="password" />

      <div className={styles.authShowPassword}>
        <label>Show Password</label>
        <CheckBoxInput onChange={hidePasswordHandler} checked={!hidePassword} />
      </div>

      <Button
        className="fill-container"
        text={isLoading && (!isSuccess || !isError) ? "LOADING" : "SIGN IN"}
        variant={ColorVariant.black}
        onClick={(e) => {
          signInHandler(e);
        }}
        disabled={isLoading && (!isSuccess || !isError)}
      />
    </>
  );
};
