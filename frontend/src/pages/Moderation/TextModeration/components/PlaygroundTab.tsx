
import styles from "@/pages/Moderation/TextModeration/index.module.css"

import { FormEvent, useEffect, useState } from "react";

import debounce from "lodash.debounce"


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

    const [requestText, setRequestText] = useState<string>('');
    const debouncedSetRequestText = debounce(setRequestText, 1000);

    const sendRequest = async (text: string) => {
        const res = await fetch("http://127.0.0.1:8000/moderation/text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({text})
        })
        const obj = await res.json()
        delete obj.text
        setResponse(obj);

    }

    useEffect(() => {if (requestText.length > 0) sendRequest(requestText)}, [requestText])

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
                            <div className={styles.responseDataContent}>
                                {"BODY: {"}
                                    {/* @ts-ignore-error */}
                                    {Object.getOwnPropertyNames(response).map((prop, ind) => (<div className={styles.responseDataField} key={ind}><div>{prop}:</div><div>{parseFloat(response[prop]).toFixed(4)},</div></div>))}
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