import { AuthStatus, ColorVariant } from "@/interfaces";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { signIn, signUp } from "@/store/auth";
import CheckBoxInput from "./ui/CheckBoxInput";

const SignInForm = () => {
    const dispatch = useAppDispatch()
    const authState = useAppSelector(state => state.auth)

    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);


    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [re_password, setRePassword] = useState<string>('');

    // TODO: add validate inputs


    const swapForms = () => {setIsSignIn(prev => !prev); }

    const signInHandler = async (e : FormEvent) => {
        e.preventDefault();
        await dispatch(signIn({username, password}))
    }

    const signUpHandler = async (e : FormEvent) => {
        e.preventDefault();
        await dispatch(signUp({email, username, password}))
    }


    return (
        <>
        {isSignIn ? (
        <div className="auth-container">
            {authState.status === AuthStatus.Loading && "Loading..."}
            <div className="form-switcher"><span onClick={swapForms}>Sign Up →</span></div>
            <form className="auth-content">
                <TextInput 
                    placeholder="USERNAME | EMAIL" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <PasswordInput  
                    placeholder="PASSWORD" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isShown={showPassword}
                />

                <div className="auth-show-password">
                    <label>Show Password</label>
                    <CheckBoxInput 
                        onChange={() => {setShowPassword(prev => !prev)}}
                        checked={showPassword}
                    /> 
                </div>


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
            {authState.status === AuthStatus.Loading && "Loading..."}
            <div className="form-switcher"><span onClick={swapForms}>Sign In →</span></div>
            <form className="auth-content">
                <TextInput 
                    placeholder="EMAIL" 
                    value={email}
                    onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                />

                <TextInput            
                    placeholder="USERNAME" 
                    value={username}
                    onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
                />

                <PasswordInput 
                    placeholder="PASSWORD" 
                    value={password}
                    onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                    isShown={showPassword}
                />

                <PasswordInput 
                    placeholder="REPEAT PASSWORD" 
                    value={re_password}
                    onChange={(e) => setRePassword((e.target as HTMLInputElement).value)}
                />

                <div className="auth-show-password">
                    <label>Show Password</label>
                    <CheckBoxInput 
                        onChange={() => {setShowPassword(prev => !prev)}}
                        checked={showPassword}
                    /> 
                </div>

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

// TODO: Error handler