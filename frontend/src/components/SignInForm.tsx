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

    const username = useTextInputProps({placeholder: "USERNAME", validation: {rule: /^[a-zA-Z0-9]{8,}$/, error: "Wrong username. Username must contain at least 8 symbols [a-Z][0-9]"}});
    const email = useTextInputProps({placeholder: "EMAIL", validation: {rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Wrong email."}});
    const password = useTextInputProps({placeholder: "PASSWORD", isHidden: hidePassword, validation: {rule: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_-])(?=\S+$).{8,}$/, error: "Wrong Password. Must contain at least 8 symbols ([a-Z], at least 1 digit and spec symbol)"}});
    const verify_password = useTextInputProps({placeholder: "REPEAT PASSWORD", isHidden: true, validation: {rule: RegExp(`^${password.value}$`), error: "Password not matched."}});

    // TODO: add validate inputs

    const swapForms = () => {setIsSignInForm(prev => !prev); }
    const hidePasswordHandler = () => {setHidePassword(prev => !prev); }

    const signInHandler = (e : FormEvent) => {
        e.preventDefault();
        dispatch(signIn({username: username.value, password: password.value}))
    }

    const signUpHandler =  (e : FormEvent) => {
        e.preventDefault();
        const usernameValid: boolean = (!!username.validation && username.validation.rule.test(username.value))
        const emailValid: boolean = (!!email.validation && email.validation.rule.test(email.value))
        const passwordValid: boolean = (!!password.validation && password.validation.rule.test(password.value))
        const rePasswordValid: boolean = (!!verify_password.validation && verify_password.validation.rule.test(verify_password.value))

        const isValid = usernameValid && emailValid && passwordValid && rePasswordValid
        console.log({email: email.value, username: username.value, password: password.value})
        if (isValid) dispatch(signUp({email: email.value, username: username.value, password: password.value}))
        else dispatch(signUp({email: '', username: '', password: ''}))
    }


    
    return (
        <div className="auth-container">
            {authState.status === StateStatus.Loading && "Loading..."}
            <div className="form-switcher"><span onClick={swapForms}>{isSignInForm ? "Sign Up →" : "Sign In →"}</span></div>
            <form className="auth-content">
            
            {isSignInForm ? (
                <>
                {authState.status === StateStatus.Error && showAlert("Error: Invalid input data")}
                <TextInput {...username} validation={undefined}/>
                <TextInput {...password} validation={undefined}/>
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