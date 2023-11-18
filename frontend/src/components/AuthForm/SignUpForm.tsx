import { ColorVariant, iTextInputProps } from "@/interfaces";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { FormEvent, useEffect, useState } from "react";
import { useTextInputProps } from "@/hooks";
import CheckBoxInput from "@/components/ui/CheckBoxInput";
import { useSignupMutation } from "@/api/authAPI";
import { AlertError } from "../ui/Alert";

import styles from "./AuthForm.module.css";

export const SignUpForm = () => {
  const [signUp] = useSignupMutation();

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const username = useTextInputProps({
    name: "username",
    placeholder: "USERNAME",
    validation: {
      rule: /^[a-zA-Z0-9]{8,}$/,
      error:
        "Wrong username. Username must contain at least 8 symbols [a-Z][0-9]",
    },
  });
  const email = useTextInputProps({
    name: "email",
    placeholder: "EMAIL",
    validation: { rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Wrong email." },
  });
  const password = useTextInputProps({
    name: "password",
    placeholder: "PASSWORD",
    isHidden: hidePassword,
    validation: {
      rule: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_-])(?=\S+$).{8,}$/,
      error:
        "Wrong Password. Must contain at least 8 symbols ([a-Z], at least 1 digit and spec symbol)",
    },
  });
  let verify_password = useTextInputProps({
    name: "verify_password",
    placeholder: "REPEAT PASSWORD",
    isHidden: true,
    validation: {
      rule: RegExp(`^${password.value}$`),
      error: "Password not matched.",
    },
  });

  const hidePasswordHandler = () => {
    setHidePassword((prev) => !prev);
  };

  const signUpHandler = (e: FormEvent) => {
    e.preventDefault();
    const usernameValid: boolean =
      !!username.validation && username.validation.rule.test(username.value);
    const emailValid: boolean =
      !!email.validation && email.validation.rule.test(email.value);
    const passwordValid: boolean =
      !!password.validation && password.validation.rule.test(password.value);
    const rePasswordValid: boolean =
      !!verify_password.validation &&
      verify_password.validation.rule.test(verify_password.value);

    const isValid =
      usernameValid && emailValid && passwordValid && rePasswordValid;
    if (isValid)
      signUp({
        email: email.value,
        username: username.value,
        password: password.value,
      });
    else {
      AlertError("Invalid input data.");
    }
  };

  return (
    <>
      <TextInput {...email} key="email" />
      <TextInput {...username} key="username" />
      <TextInput {...password} key="password" />
      <TextInput {...verify_password} key="verify_password" />

      <div className={styles.authShowPassword}>
        <label>Show Password</label>
        <CheckBoxInput onChange={hidePasswordHandler} checked={!hidePassword} />
      </div>

      <Button
        className="fill-container"
        text="SIGN UP"
        variant={ColorVariant.black}
        onClick={(e) => {
          signUpHandler(e);
        }}
      />
    </>
  );
};
