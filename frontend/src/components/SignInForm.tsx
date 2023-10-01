import { ColorVariant } from "@/interfaces";
import Button from "./ui/Button";
import TextInput from "./ui/TextInput";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { signIn } from "@/store/auth";

const SignInForm = () => {
    const [isSignIn, SetIsSignIn] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [re_password, setRePassword] = useState<string>('');

    const dispatch = useAppDispatch()
    // const authState = useAppSelector(state => state.auth)
    // console.log(authState)

    const swapForms = () => {
        SetIsSignIn(prev => !prev);    
    }

    const signInHandler = async (e : FormEvent) => {
        e.preventDefault();
        await dispatch(signIn({username, password}))
    }

    const signUpHandler = async (e : FormEvent) => {
        e.preventDefault();
        // await dispatch(signIn({username, password}))
    }

    return (
        <>
        {isSignIn ? (
        <div className="auth-container">
            <div className="form-switcher"><span onClick={swapForms}>Sign Up →</span></div>
            <form className="auth-content">
                <TextInput 
                    name="login" 
                    placeholder="LOGIN" 
                    onChange={setUsername}
                />

                <TextInput 
                    name="password" 
                    placeholder="PASSWORD" 
                    onChange={setPassword}
                />

                <Button 
                    className="fill-container" 
                    text="SIGN IN" 
                    variant={ColorVariant.black} 
                    onClick={(e) => {signInHandler(e)}}
                />
            </form>
        </div>
        ) : (
        <div className="auth-container">
            <div className="form-switcher"><span onClick={swapForms}>Sign In →</span></div>
            <form className="auth-content">
                <TextInput 
                    name="email" 
                    placeholder="EMAIL" 
                    onChange={setEmail}
                />

                <TextInput                 
                    name="username" 
                    placeholder="USERNAME" 
                    onChange={setUsername}
                />

                <TextInput 
                    name="password" 
                    placeholder="PASSWORD" 
                    onChange={setPassword}
                />

                <TextInput 
                    name="re_password" 
                    placeholder="REPEAT PASSWORD" 
                    onChange={setRePassword}
                />

                <Button 
                    className="fill-container" 
                    text="SIGN UP" 
                    variant={ColorVariant.black} 
                    onClick={(e) => {signUpHandler(e)}}
                />

            </form>
        </div>
        )}
        </>
    );
};

export default SignInForm;