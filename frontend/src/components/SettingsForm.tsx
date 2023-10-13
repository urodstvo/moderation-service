import CheckBoxInput from "@/components/ui/CheckBoxInput";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Timer from "@/components/Timer";
import { useAppDispatch, useAppSelector, usePageTitle, useTextInputProps } from "@/hooks";
import { ColorVariant } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import { sendVerificationCode, verifyEmail } from "@/store/auth";
import ClipboardCopyIcon from "./icon/ClipboardCopyIcon";
import VisibilityIcon from "./icon/VisibilityIcon";
import { showAlert } from "./ui/Alert";

const SettingsForm = () => {
    usePageTitle("SETTINGS | CLOUD");
    
    const dispatch = useAppDispatch()
    const { token, user } = useAppSelector(state => state.auth);
    const codeElement = useRef<HTMLDivElement>(null);
    
    const [changes, setChanges] = useState<number>(0)
    
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);


    const verificationHandler = async () => {
        if (isVerifying && token) {
            const element = codeElement.current as HTMLDivElement
            const inputs = [...element.querySelectorAll('input')]
            
            const code = inputs.map(el => el.value).join('')
            
            await dispatch(verifyEmail({code: code, token: token}))

            setTimeout(() => setIsVerifying(false), 1000)
            setChanges(0);
        }
    }

    useEffect(() => {
        if (isVerifying){
            const code = codeElement.current as HTMLDivElement
            const inputs = [...code.querySelectorAll('input')]

            const backSpaceHandler = (e: KeyboardEvent) => {
                const target = e.target as HTMLInputElement
                const ind: number = parseInt(target.classList.toString())
                if (e.key === "Backspace" && target.value === '') inputs[Math.max(0, ind-1)].focus()
            }

            const inputHandler = (e : any) => {
                const target = e.target
                const ind: number = parseInt(target.classList.toString())

                const [first, ...rest] = target.value
                
                target.value = first ?? '' 
                
                const lastInputBox = ind === inputs.length-1    
                const didInsertContent = first !== undefined
                
                if (didInsertContent && !lastInputBox) {
                    inputs[ind+1].focus()
                    inputs[ind+1].value = rest.join('')
                    inputs[ind+1].dispatchEvent(new Event('input'))
                }
                }
            
                inputs.forEach((el)=>{
                    el.addEventListener('keydown', backSpaceHandler);
                    el.addEventListener('input', inputHandler)
                })

                return () => {
                    inputs.forEach((el)=>{
                        el.removeEventListener('keydown', backSpaceHandler);
                        el.removeEventListener('input', inputHandler)
                    })
                }
            }
    }, [isVerifying])

    const sendMail = () => {
        setChanges(prev => prev + 1);
        setIsVerifying(true); 
        sendVerificationCode({token: token!});
    }

    const timerCallback = () => {
        setIsVerifying(false); 
        setError(true);
    }

    const [shownAPIKey, setShownAPIKey] = useState<boolean>(false)



    const username = useTextInputProps({placeholder: "USERNAME", className: "flex-1", disabled: true});
    const email = useTextInputProps({placeholder: "EMAIL", className: "flex-1", disabled: true});
    const role = useTextInputProps({placeholder: "ROLE", className: "flex-1", disabled: true});
    const api_token = useTextInputProps({placeholder: "API KEY", className: "flex-1", disabled: true, isHidden: !shownAPIKey});

    const [copied, setCopied] = useState<boolean>(false)

    const copyAPIKey = () => {
        navigator.clipboard.writeText(user!.api_token); 
        setCopied(true);
        setTimeout(() => setCopied(false), 3000)
    }

    return (
        <>
        {copied && showAlert("API Key copied to clipboard.")}
        {!!user && (        
        <div className="settings-container">
            <div className="settings-content">
                <div className="settings-username">
                    <TextInput {...username} value={user.username}/>
                </div>

                <div className="settings-email">
                    <TextInput {...email} value={user.email} />
                    <CheckBoxInput checked={user.is_verified} disabled />
                </div>

                <div className="settings-verification">
                    {!user.is_verified && (
                        <>
                        {!isVerifying ? (
                            <>
                            <div className="verification-info">
                                <div className="verification-action" onClick={sendMail}> Verify Email </div>
                                <div>Email Is Not Verified</div>
                            </div>
                            {error && <div className="verification-error" onClick={() => setError(false)}>Sorry, you didn't have time to enter the code. Try again.</div>}
                            </>
                        ) : (
                            <>
                            <div className="verification-info">
                                <div>Enter the code from your email</div>
                                <Timer
                                    className="verification-timer"
                                    seconds={60}
                                    callback={timerCallback}
                                />
                            </div>
                            <div className="verification-code" ref={codeElement}>
                                <input className="0"/>
                                <input className="1"/>
                                <input className="2"/>
                                <input className="3"/>
                            </div>
                            </>
                        )}
                        </>
                    )}
                </div>
                <div className="settings-role">
                        <TextInput {...role} value={user.role.toUpperCase()}/>
                </div>
                {user.api_token && (
                <div className="settings-api-key">
                        <TextInput {...api_token} value={user.api_token}/>
                        <div className="settings-api-key-actions">
                            <div className="settings-api-key-action" onClick={() => setShownAPIKey(prev => !prev)}>
                                <VisibilityIcon />
                            </div>
                            <div className="settings-api-key-action" onClick={() => {copyAPIKey()}}>
                                <ClipboardCopyIcon />
                            </div>
                        </div>
                </div>
                )}
            </div>


            {!!changes && (
            <Button 
                className="width-100"
                text={isVerifying ? "VERIFY" : "SAVE"}
                variant={ColorVariant.black}
                onClick={verificationHandler}
                disabled={!isVerifying}
            />)}
        </div>)}
        </>
    );
};

// TODO: Error handler

export default SettingsForm;