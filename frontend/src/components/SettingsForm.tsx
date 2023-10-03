import { useAppDispatch, useAppSelector } from "@/hooks";
import TextInput from "@/components/ui/TextInput";
import CheckBoxInput from "@/components/ui/CheckBoxInput";
import Button from "@/components/ui/Button";
import { ColorVariant } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import Timer from "@/components/Timer";
import { sendVerificationCode, verifyEmail } from "@/store/auth";

const SettingsForm = () => {
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const codeElement = useRef<HTMLDivElement>(null);
    const { token, user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch()

    const onClick = () => {
        {if (isVerifying) {
            const element = codeElement.current as HTMLDivElement
            const inputs = [...element.querySelectorAll('input')]
            const code = inputs.map(el => el.value).join('')
            dispatch(verifyEmail({
                                    email: user?.email as string,
                                    code: code,
                                    token: token as string 
                                })
                    )
            setIsVerifying(false);
        }}
    }

    useEffect(() => {
        if (isVerifying){
            const code = codeElement.current as HTMLDivElement
            const inputs = [...code.querySelectorAll('input')]

            inputs.forEach(el => el.disabled = false)

            const backSpaceHandler = (e: KeyboardEvent) => {
                const target = e.target as HTMLInputElement
                const ind: number = parseInt(target.classList.toString())
                if (e.key === "Backspace" && target.value === '') inputs[Math.max(0, ind-1)].focus()
            }

            const inputHandler = (e : any) => {
                const target = e.target
                const ind: number = parseInt(target.classList.toString())

                const [first,...rest] = target.value
                
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
                el.disabled = false;
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

    return (
        <div className="settings-container">
            <div className="settings-content">
                <div className="settings-username">
                    <TextInput 
                        className="flex-1"
                        placeholder="USERNAME"
                        value={user?.username} 
                        disabled
                    />
                </div>

                <div className="settings-email">
                    <TextInput 
                        className="flex-1"
                        placeholder="EMAIL"
                        value={user?.email} 
                        disabled
                    />

                    <CheckBoxInput 
                        checked={user?.is_verified}
                        disabled
                    />
                </div>

                <div className="settings-verification">
                    {user?.is_verified ? "Email Verified" : (
                        <>
                        {!isVerifying ? (
                            <>
                            <div className="verification-info">
                                <div 
                                    className="verification-action" 
                                    onClick={() => {setIsVerifying(true); sendVerificationCode({email: user!.email as string, token: token as string})}}
                                >
                                    Verify Email
                                </div>
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
                                    callback={() => {setIsVerifying(false); setError(true)}}
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
            </div>

            <Button 
                className="width-100"
                text={isVerifying ? "VERIFY" : "SAVE"}
                variant={ColorVariant.black}
                onClick={() => onClick()}
                disabled={!isChanged && !isVerifying}
            />
        </div>
    );
};

// TODO: Error handler

export default SettingsForm;