import styles from "@/pages/Moderation/styles/Playground.module.css";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  useAudioModerationMutation,
  useImageModerationMutation,
  useTextModerationMutation,
  useVideoModerationMutation,
} from "@/api/moderationAPI";
import { AlertError } from "@/components/ui/Alert";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ModerationType } from "@/interfaces";
import { useTranslation } from "react-i18next";

const TextRequest = ({ onResponse }: { onResponse: any }) => {
  const { t } = useTranslation();
  const [moderate, { isSuccess, isError, data, error }] =
    useTextModerationMutation();
  const [requestText, setRequestText] = useState<string>("");
  const debouncedSetRequestText = debounce(setRequestText, 300);

  useEffect(() => {
    if (isSuccess) {
      onResponse(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) AlertError("Cannot send request");
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
        placeholder={t("services.moderationService.textPlaceholder")}
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
    if (error) AlertError("Cannot send request");
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

const AudioRequest = ({ onResponse }: { onResponse: any }) => {
  const [requested, setRequested] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);
  const audio = useRef<HTMLAudioElement>(null);

  const [moderate, { isSuccess, isError, data, error }] =
    useAudioModerationMutation();
  const [requestAudio, setRequestAudio] = useState<File | null>(null);
  const [requestLanguage, setRequestLanguage] = useState<string>("rus");

  useEffect(() => {
    if (isSuccess) {
      onResponse(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) AlertError("Cannot send request");
  }, [isError]);

  const sendAudioRequest = async (file: File, lang: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("lang", lang);
    await moderate(data);
  };

  useEffect(() => {
    if (input.current && input.current.files?.length) {
      sendAudioRequest(input.current!.files[0], requestLanguage);
    }
  }, [requestAudio, requestLanguage]);

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
        accept=".wav"
        className={styles.requestContent}
        ref={input}
        onInput={(e) => {
          if (e.currentTarget.files) {
            audio.current!.src = window.URL.createObjectURL(
              e.currentTarget.files[0]
            );
            setRequestAudio(e.currentTarget.files[0]);
          }
        }}
        onChange={() => setRequested(true)}
      />
      <div
        className={styles.requestFile}
        style={{ display: requested ? "block" : "none" }}
      >
        <audio controls className={styles.requestAudio} src="" ref={audio} />
        <button
          className={styles.requestBtn}
          onClick={() => input.current?.click()}
        >
          Load another audio
        </button>
      </div>
    </div>
  );
};

const VideoRequest = ({ onResponse }: { onResponse: any }) => {
  const [requested, setRequested] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const [moderate, { isSuccess, isError, data, error }] =
    useVideoModerationMutation();
  const [requestVideo, setRequestVideo] = useState<File | null>(null);
  const [requestLanguage, setRequestLanguage] = useState<string>("rus");

  useEffect(() => {
    if (isSuccess) {
      onResponse(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) AlertError("Cannot send request");
  }, [isError]);

  const sendVideoRequest = async (file: File, lang: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("lang", lang);
    await moderate(data);
  };

  useEffect(() => {
    if (input.current && input.current.files?.length) {
      sendVideoRequest(input.current!.files[0], requestLanguage);
    }
  }, [requestVideo, requestLanguage]);

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
        accept="video/*"
        className={styles.requestContent}
        ref={input}
        onInput={(e) => {
          if (e.currentTarget.files) {
            video.current!.src = window.URL.createObjectURL(
              e.currentTarget.files[0]
            );
            setRequestVideo(e.currentTarget.files[0]);
          }
        }}
        onChange={() => setRequested(true)}
      />
      <div
        className={styles.requestFile}
        style={{ display: requested ? "block" : "none" }}
      >
        <video controls className={styles.requestImage} src="" ref={video} />
        <button
          className={styles.requestBtn}
          onClick={() => input.current?.click()}
        >
          Load another video
        </button>
      </div>
    </div>
  );
};

const PlaygroundTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { type } = useParams();

  useEffect(() => {
    if (!type || !(type in ModerationType)) {
      navigate("/page-not-found");
    }
  }, []);

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
      <div className={styles.playgroundSwitcher}>
        <menu className={styles.playgroundMenu}>
          <li
            className={[
              styles.playgroundMenuItem,
              type === "text" ? styles.active : "",
            ].join(" ")}
          >
            <Link to="/services/moderation/playground/text">
              {t("services.moderationService.textTab")}
            </Link>
          </li>
          <li
            className={[
              styles.playgroundMenuItem,
              type === "image" ? styles.active : "",
            ].join(" ")}
          >
            <Link to="/services/moderation/playground/image">
              {t("services.moderationService.imageTab")}
            </Link>
          </li>
          <li
            className={[
              styles.playgroundMenuItem,
              type === "audio" ? styles.active : "",
            ].join(" ")}
          >
            <Link to="/services/moderation/playground/audio">
              {t("services.moderationService.audioTab")}
            </Link>
          </li>
          <li
            className={[
              styles.playgroundMenuItem,
              type === "video" ? styles.active : "",
            ].join(" ")}
          >
            <Link to="/services/moderation/playground/video">
              {t("services.moderationService.videoTab")}
            </Link>
          </li>
        </menu>
      </div>
      <div className={styles.playgroundWrapper}>
        <div className={styles.playgroundSection}>
          {type === "text" && <TextRequest onResponse={setResponse} />}
          {type === "image" && <ImageRequest onResponse={setResponse} />}
          {type === "audio" && <AudioRequest onResponse={setResponse} />}
          {type === "video" && <VideoRequest onResponse={setResponse} />}
        </div>
        <div className={styles.playgroundSection}>
          <div className={styles.responseContainer}>
            <div className={styles.responseContent}>
              <div className={styles.responseDataContainer}>
                //response.json
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
