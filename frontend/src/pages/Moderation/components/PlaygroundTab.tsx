import styles from "@/pages/Moderation/styles/Playground.module.css";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  useImageModerationMutation,
  useTextModerationMutation,
} from "@/api/moderationAPI";
import { AlertError } from "@/components/ui/Alert";
import { useParams } from "react-router-dom";

const TextRequest = ({ onResponse }: { onResponse: any }) => {
  const [moderate, { isSuccess, isError, data, error }] =
    useTextModerationMutation();
  const [requestText, setRequestText] = useState<string>("");
  const debouncedSetRequestText = debounce(setRequestText, 750);

  useEffect(() => {
    if (isSuccess) {
      onResponse(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) AlertError(error.toString());
  }, [isError]);

  const sendTextRequest = async (text: string) => {
    await moderate(text);
  };

  useEffect(() => {
    if (requestText.length > 0) sendTextRequest(requestText);
    return () => {
      debouncedSetRequestText.cancel();
    };
  }, [requestText]);

  return (
    <div className={styles.requestContainer}>
      <textarea
        className={styles.requestContent}
        placeholder="Type Request Text"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          debouncedSetRequestText(e.currentTarget.value ?? "");
        }}
      />
    </div>
  );
};

const ImageRequest = ({ onResponse }: { onResponse: any }) => {
  const [requested, setRequested] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLImageElement>(null);

  const [moderate, { isSuccess, isError, data, error }] =
    useImageModerationMutation();
  const [requestImage, setRequestImage] = useState<File | null>(null);
  const [requestLanguage, setRequestLanguage] = useState<string>("rus");

  useEffect(() => {
    if (isSuccess) {
      onResponse(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) AlertError(error.toString());
  }, [isError]);

  const sendImageRequest = async (file: File, lang: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("lang", lang);
    await moderate(data);
  };

  useEffect(() => {
    if (input.current && input.current.files?.length) {
      sendImageRequest(input.current!.files[0], requestLanguage);
    }
  }, [requestImage, requestLanguage]);

  return (
    <div className={styles.requestContainer}>
      <select
        className={styles.requestLanguage}
        onChange={(e) => setRequestLanguage(e.currentTarget.value)}
      >
        <option value="rus">rus</option>
        <option value="eng">eng</option>
      </select>
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className={styles.requestContent}
        ref={input}
        onInput={(e) => {
          if (e.currentTarget.files) {
            image.current!.src = window.URL.createObjectURL(
              e.currentTarget.files[0]
            );
            setRequestImage(e.currentTarget.files[0]);
          }
        }}
        onChange={() => setRequested(true)}
      />
      <div
        className={styles.requestFile}
        style={{ display: requested ? "block" : "none" }}
      >
        <img
          className={styles.requestImage}
          src=""
          alt="requestedImage"
          ref={image}
        />
        <button
          className={styles.requestBtn}
          onClick={() => input.current?.click()}
        >
          Load another image
        </button>
      </div>
    </div>
  );
};

const PlaygroundTab = () => {
  const { type } = useParams();

  type Response = {
    toxic: string;
    severe_toxic: string;
    insult: string;
    obscene: string;
    identity_hate: string;
    threat: string;
  };

  const [response, setResponse] = useState<Response>({
    toxic: "0",
    severe_toxic: "0",
    obscene: "0",
    threat: "0",
    insult: "0",
    identity_hate: "0",
  });

  return (
    <>
      <div className={styles.playgroundWrapper}>
        <div className={styles.playgroundSection}>
          {type === "text" && <TextRequest onResponse={setResponse} />}
          {type === "image" && <ImageRequest onResponse={setResponse} />}
        </div>
        <div className={styles.playgroundSection}>
          <div className={styles.responseContainer}>
            <div className={styles.responseContent}>
              <div className={styles.responseDataContainer}>
                response.json
                <div className={[styles.responseDataContent].join(" ")}>
                  {"body: {"}
                  {Object.getOwnPropertyNames(response).map((prop, ind) => (
                    <div className={styles.responseDataField} key={ind}>
                      <div>{prop}:</div>
                      {/* @ts-ignore-error */}
                      <div>{parseFloat(response[prop]).toFixed(4)},</div>
                    </div>
                  ))}
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
