import styles from "@/pages/Moderation/TextModeration/index.module.css";

import ClipboardCopyIcon from "@/components/icon/ClipboardCopyIcon";
import VisibilityIcon from "@/components/icon/VisibilityIcon";
import Button from "@/components/ui/Button";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { ColorVariant, RoleEnum } from "@/interfaces";
import { generateAPIToken } from "@/store/auth";
import { useRef } from "react";
import { AlertInfo } from "@/components/ui/Alert";

const IntegrationTab = ({ text }: { text: string }) => {
  const dispatch = useAppDispatch();
  const parsedText = text.split("\n").map((el, ind) => <p key={ind}>{el}</p>);

  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const apiField = useRef<HTMLDivElement>(null);

  const showAPIKey = () => {
    let isVisible = false;

    return () => {
      if (!isVisible)
        (apiField.current as HTMLDivElement).innerText = user!.api_token;
      else (apiField.current as HTMLDivElement).innerText = "API TOKEN";
      isVisible = !isVisible;
    };
  };

  const copyAPIKey = () => {
    navigator.clipboard.writeText(user!.api_token);
    AlertInfo("API Key copied to clipboard.");
  };

  return (
    <div className={styles.integrationWrapper}>
      <div className={styles.integrationSection}>
        <div className={styles.apiInfo}>{parsedText}</div>
        {user && (
          <>
            {user.api_token ? (
              <div className={styles.apiContainer}>
                <div className={styles.apiContent}>
                  <div className={styles.apiData} ref={apiField}>
                    API TOKEN
                  </div>
                  <div className={styles.apiActions}>
                    <div className={styles.apiAction} onClick={showAPIKey()}>
                      <VisibilityIcon />
                    </div>
                    <div
                      className={styles.apiAction}
                      onClick={() => {
                        copyAPIKey();
                      }}
                    >
                      <ClipboardCopyIcon />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.apiGenerateButton}>
                <Button
                  text="Generate API Key"
                  variant={ColorVariant.black}
                  className="width-100"
                  onClick={
                    token
                      ? async () => {
                          dispatch(generateAPIToken({ token }));
                        }
                      : () => {}
                  }
                  disabled={!(user.role !== RoleEnum.User)}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.playgroundSection}></div>
    </div>
  );
};

export default IntegrationTab;
