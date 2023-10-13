import CheckBoxInput from "@/components/ui/CheckBoxInput";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Timer from "@/components/Timer";
import { useAppDispatch, useAppSelector, usePageTitle, useTextInputProps } from "@/hooks";
import { ColorVariant } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import { sendVerificationCode, verifyEmail } from "@/store/auth";

const SettingsForm = () => {
    usePageTitle("SETTINGS | CLOUD");
    
    const { token, user} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch()
    const codeElement = useRef<HTMLDivElement>(null);
    
    const [changes, setChanges] = useState<number>(0)
    
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);


    const verificationHandler = () => {
        if (isVerifying) {
            const element = codeElement.current as HTMLDivElement
            const inputs = [...element.querySelectorAll('input')]
            
            const code = inputs.map(el => el.value).join('')
            
            dispatch(verifyEmail({code: code, token: token!}))

            setIsVerifying(false);
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

    return (
        <>
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
                <div className="settings-api-key">
                        <TextInput {...api_token} value={user.api_token}/>
                        <div className="settings-api-key-actions">
                            <div className="settings-api-key-action" onClick={() => setShownAPIKey(prev => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="settings-api-key-action" onClick={() => {navigator.clipboard.writeText(user.api_token)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M2.625 22.5H17.625C17.9234 22.5 18.2095 22.3815 18.4205 22.1705C18.6315 21.9595 18.75 21.6734 18.75 21.375V6C18.75 5.80109 18.671 5.61032 18.5303 5.46967C18.3897 5.32902 18.1989 5.25 18 5.25H2.625C2.32663 5.25 2.04048 5.36853 1.82951 5.5795C1.61853 5.79048 1.5 6.07663 1.5 6.375V21.375C1.5 21.6734 1.61853 21.9595 1.82951 22.1705C2.04048 22.3815 2.32663 22.5 2.625 22.5Z" fill="white"/>
                                    <path d="M18.75 3.75H5.25V2.625C5.25 2.32663 5.36853 2.04048 5.57951 1.8295C5.79048 1.61853 6.07663 1.5 6.375 1.5H21.1875C21.5356 1.5 21.8694 1.63828 22.1156 1.88442C22.3617 2.13056 22.5 2.4644 22.5 2.8125V17.625C22.5 17.9234 22.3815 18.2095 22.1705 18.4205C21.9595 18.6315 21.6734 18.75 21.375 18.75H20.25V5.25C20.25 4.85218 20.092 4.47064 19.8107 4.18934C19.5294 3.90804 19.1478 3.75 18.75 3.75Z" fill="white"/>
                                </svg>
                            </div>
                        </div>
                </div>
            </div>


            {!!changes && (
            <Button 
                className="width-100"
                text={isVerifying ? "VERIFY" : "SAVE"}
                variant={ColorVariant.black}
                onClick={verificationHandler}
                disabled={!isChanged && !isVerifying}
            />)}
        </div>)}
        </>
    );
};

// TODO: Error handler

export default SettingsForm;