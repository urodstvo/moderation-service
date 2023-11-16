
import styles from "@/pages/Moderation/TextModeration/index.module.css"

import { FormEvent, useEffect, useState } from "react";
import debounce from "lodash.debounce"
import { useTextModerationMutation } from "@/api/moderationAPI";
import { AlertError } from "@/components/ui/Alert";


const PlaygroundTab = () => {
    type Response = {
        toxic: string,
        severe_toxic: string,
        insult: string,
        obscene: string,
        identity_hate: string,
        threat: string
    }

    const [response, setResponse] = useState<Response>({
        toxic: '-',
        severe_toxic: '-',
        obscene: '-',
        threat: '-',
        insult: '-',
        identity_hate: '-',
    }) 

    const [moderate, {isSuccess, isError, data, error}] = useTextModerationMutation()
    const [requestText, setRequestText] = useState<string>('');
    const debouncedSetRequestText = debounce(setRequestText, 1000);

    useEffect(() => {if (isSuccess) { 
        const {text, ...response} = data; 
        setResponse(response)
    }}, [isSuccess])
    useEffect(() => {if (isError && error) AlertError(error.toString())}, [isError])

    const sendRequest = async (text: string) => { await moderate(text) }

    useEffect(() => {
        if (requestText.length > 0)  sendRequest(requestText);}, [requestText])

    return (
        <>
        <div className={styles.playgroundWrapper}>
            <div className={styles.playgroundSection}>
                <div className={styles.requestContainer}>
                    <div className={styles.requestContent} 
                        placeholder="Type Request Text"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e: FormEvent<HTMLDivElement>)  => {debouncedSetRequestText(e.currentTarget.textContent ?? '')}}
                    />
                </div>
            </div>
            <div className={styles.playgroundSection}>
                <div className={styles.responseContainer}>
                    <div className={styles.responseContent}>
                        <div className={styles.responseDataContainer}>
                            response.json
                            <div className={[styles.responseDataContent].join(' ')}>
                                {"BODY: {"}
                                    {/* @ts-ignore-error */}
                                    {Object.getOwnPropertyNames(response).map((prop, ind) => (<div className={styles.responseDataField} key={ind}><div>{prop}:</div><div>{(parseFloat(response[prop])).toFixed(4)},</div></div>))}
                                {"}"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default PlaygroundTab;