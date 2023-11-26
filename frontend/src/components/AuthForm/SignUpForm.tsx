import { ColorVariant } from "@/interfaces";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { FormEvent, useState } from "react";
import { useTextInputProps } from "@/hooks";
import CheckBoxInput from "@/components/ui/CheckBoxInput";
import { useSignupMutation } from "@/api/authAPI";
import { AlertError } from "../ui/Alert";

import styles from "./AuthForm.module.css";
import { useTranslation } from "react-i18next";

export const SignUpForm = () => {
  const { t } = useTranslation();
  const [signUp] = useSignupMutation();

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const username = useTextInputProps({
    name: "username",
    placeholder: t("auth.username"),
    validation: {
      rule: /^[a-zA-Z0-9]{8,}$/,
      error: t("auth.usernameValidation"),
    },
  });
  const email = useTextInputProps({
    name: "email",
    placeholder: t("auth.email"),
    validation: {
      rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: t("auth.emailValidation"),
    },
  });
  const password = useTextInputProps({
    name: "password",
    placeholder: t("auth.password"),
    isHidden: hidePassword,
    validation: {
      rule: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_-])(?=\S+$).{8,}$/,
      error: t("auth.passwordValidation"),
    },
  });
  let verify_password = useTextInputProps({
    name: "verify_password",
    placeholder: t("auth.confirmPassword"),
    isHidden: true,
    validation: {
      rule: RegExp(`^${password.value}$`),
      error: t("auth.confirmPasswordValidation"),
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
      AlertError(t("auth.invalidInput"));
    }
  };

  return (
    <>
      <TextInput {...email} key="email" />
      <TextInput {...username} key="username" />
      <TextInput {...password} key="password" />
      <TextInput {...verify_password} key="verify_password" />

      <div className={styles.authShowPassword}>
        <label>{t("auth.showPassword")}</label>
        <CheckBoxInput onChange={hidePasswordHandler} checked={!hidePassword} />
      </div>

      <Button
        className="fill-container"
        text={t("auth.signUp")}
        variant={ColorVariant.black}
        onClick={(e) => {
          signUpHandler(e);
        }}
      />
    </>
  );
};
