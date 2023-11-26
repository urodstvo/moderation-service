import { useState } from "react";
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";

import styles from "./AuthForm.module.css";
import { useTranslation } from "react-i18next";

const AuthForm = () => {
  const { t } = useTranslation();
  const [isSignInForm, setIsSignInForm] = useState<boolean>(true);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formSwitcher}>
        <span onClick={() => setIsSignInForm((prev) => !prev)}>
          {isSignInForm ? t("auth.signUp") + " →" : t("auth.signIn") + " →"}
        </span>
      </div>
      <form className={styles.authContent}>
        {isSignInForm ? <SignInForm /> : <SignUpForm />}
      </form>
    </div>
  );
};

export default AuthForm;
