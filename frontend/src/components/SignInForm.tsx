import { StateStatus, ColorVariant } from "@/interfaces";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector, useTextInputProps } from "@/hooks";
import { signIn, signUp } from "@/store/auth";
import CheckBoxInput from "./ui/CheckBoxInput";

const SignInForm = () => {
    const dispatch = useAppDispatch()
    const authState = useAppSelector(state => state.auth)

    const [isSignInForm, setIsSignInForm] = useState<boolean>(true);
    const [hidePassword, setHidePassword] = useState<boolean>(true);

    const username = useTextInputProps({placeholder: "USERNAME"});
    const email = useTextInputProps({placeholder: "EMAIL"})
    const password = useTextInputProps({placeholder: "PASSWORD", isHidden: hidePassword})
    const verify_password = useTextInputProps({placeholder: "REPEAT PASSWORD", isHidden: true})

    // TODO: add validate inputs

    const swapForms = () => {setIsSignInForm(prev => !prev); }
    const hidePasswordHandler = () => {setHidePassword(prev => !prev); }

    const signInHandler = async (e : FormEvent) => {
        e.preventDefault();
        await dispatch(signIn({username: username.value, password: password.value}))
    }

    const signUpHandler = async (e : FormEvent) => {
        e.preventDefault();
        await dispatch(signUp({email: email.value, username: username.value, password: password.value}))
    }


    return (
        <div className="auth-container">
            {authState.status === StateStatus.Loading && "Loading..."}
            <div className="form-switcher"><span onClick={swapForms}>{isSignInForm ? "Sign Up →" : "Sign In →"}</span></div>
            <form className="auth-content">
            
            {isSignInForm ? (
                <>
                <TextInput {...username} />
                <TextInput {...password} />
                </>
            ) : (
                <>
                <TextInput {...email} />
                <TextInput {...username} />
                <TextInput {...password} />
                <TextInput {...verify_password} />
                </>
            )}

                <div className="auth-show-password">
                    <label>Show Password</label>
                    <CheckBoxInput 
                        onChange={hidePasswordHandler}
                        checked={!hidePassword}
                    /> 
                </div>

            {isSignInForm ? (
                <Button 
                    className="fill-container" 
                    text="SIGN IN" 
                    variant={ColorVariant.black} 
                    onClick={(e) => {signInHandler(e)}}
                />
            ) : (
                <Button 
                    className="fill-container" 
                    text="SIGN UP" 
                    variant={ColorVariant.black} 
                    onClick={(e) => {signUpHandler(e)}}
                />
            )}
            </form>
        </div>
    );
};

export default SignInForm;

// TODO: Error handler