import { StateStatus, ColorVariant } from "@/interfaces";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector, useTextInputProps } from "@/hooks";
import { signIn, signUp } from "@/store/auth";
import CheckBoxInput from "@/components/ui/CheckBoxInput";
import { showAlert } from "@/components/ui/Alert";

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

    const signInHandler = (e : FormEvent) => {
        e.preventDefault();
        dispatch(signIn({username: username.value, password: password.value}))
    }

    const signUpHandler =  (e : FormEvent) => {
        e.preventDefault();
        dispatch(signUp({email: email.value, username: username.value, password: password.value}))
    }

    
    return (
        <div className="auth-container">
            {authState.status === StateStatus.Loading && "Loading..."}
            <div className="form-switcher"><span onClick={swapForms}>{isSignInForm ? "Sign Up →" : "Sign In →"}</span></div>
            <form className="auth-content">
            
            {isSignInForm ? (
                <>
                {authState.status === StateStatus.Error && showAlert("Error: Invalid input data")}
                <TextInput {...username} />
                <TextInput {...password} />
                </>
            ) : (
                <>
                {authState.status === StateStatus.Error && showAlert("Error: Validation error")}
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
                    text={authState.status === StateStatus.Loading ? "LOADING" : "SIGN IN" }
                    variant={ColorVariant.black} 
                    onClick={(e) => {signInHandler(e)}}
                    disabled={authState.status === StateStatus.Loading}
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