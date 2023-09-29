import { ColorVariant } from "@/interfaces";
import Button from "./ui/Button";
import TextInput from "./ui/TextInput";
import { useState } from "react";

const SignInForm = () => {
    const [isSignIn, SetIsSignIn] = useState<boolean>(true);

    return (
        <>
        {isSignIn ? (
        <div className="auth-container">
            <div className="form-switcher"><span onClick={() => (SetIsSignIn(false))}>Sign Up →</span></div>
            <form className="auth-content">
                <TextInput name="login" placeholder="LOGIN" />
                <TextInput name="password" placeholder="PASSWORD" />
                <Button className="fill-container" text="SIGN IN" variant={ColorVariant.black} />
            </form>
        </div>
        ) : (
            <div className="auth-container">
            <div className="form-switcher"><span onClick={() => (SetIsSignIn(true))}>Sign In →</span></div>
            <form className="auth-content">
                <TextInput name="email" placeholder="EMAIL" />
                <TextInput name="login" placeholder="LOGIN" />
                <TextInput name="password" placeholder="PASSWORD" />
                <Button className="fill-container" text="SIGN UP" variant={ColorVariant.black} />
            </form>
        </div>
        )}
        </>
    );
};

export default SignInForm;