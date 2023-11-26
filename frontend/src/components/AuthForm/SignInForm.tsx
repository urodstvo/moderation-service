import { FormEvent, useState } from "react";
import { useLoginMutation } from "@/api/authAPI";
import { ColorVariant } from "@/interfaces";
import { useTextInputProps } from "@/hooks";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import CheckBoxInput from "@/components/ui/CheckBoxInput";

import styles from "./AuthForm.module.css";
import { useTranslation } from "react-i18next";

export const SignInForm = () => {
  const { t } = useTranslation();
  const [signin, { isLoading }] = useLoginMutation();

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const username = useTextInputProps({
    placeholder: t("auth.username"),
  });
  const password = useTextInputProps({
    placeholder: t("auth.password"),
    isHidden: hidePassword,
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
        <label>{t("auth.showPassword")}</label>
        <CheckBoxInput onChange={hidePasswordHandler} checked={!hidePassword} />
      </div>

      <Button
        className="fill-container"
        text={isLoading ? t("auth.loading") : t("auth.signIn")}
        variant={ColorVariant.black}
        onClick={(e) => {
          signInHandler(e);
        }}
        disabled={isLoading}
      />
    </>
  );
};
