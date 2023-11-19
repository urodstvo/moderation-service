import CheckBoxInput from "@/components/ui/CheckBoxInput";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Timer from "@/components/Timer";
import {
  useAppDispatch,
  useAppSelector,
  usePageTitle,
  useTextInputProps,
} from "@/hooks";
import { ColorVariant } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import ClipboardCopyIcon from "./icon/ClipboardCopyIcon";
import VisibilityIcon from "./icon/VisibilityIcon";
import { AlertError, AlertInfo, AlertSuccess } from "./ui/Alert";
import { useSendCodeMutation, useVerifyEmailMutation } from "@/api/emailAPI";
import { verify } from "@/store/auth";

const SettingsForm = () => {
  usePageTitle("SETTINGS | CLOUD");

  const dispatch = useAppDispatch();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [verifyEmail, { isSuccess: emailVerified }] = useVerifyEmailMutation();
  const [requestEmail, { isSuccess: emailSended, isLoading: emailSending }] =
    useSendCodeMutation();

  useEffect(() => {
    if (emailVerified) {
      dispatch(verify());
      AlertSuccess("Your email was verified");
    }
  }, [emailVerified]);

  useEffect(() => {
    if (emailSended) setIsVerifying(true);
  }, [emailSended]);

  const { user } = useAppSelector((state) => state.auth);
  const codeElement = useRef<HTMLDivElement>(null);

  const sendMail = async () => {
    await requestEmail();
  };

  const verificationHandler = async () => {
    if (isVerifying) {
      const element = codeElement.current as HTMLDivElement;
      const inputs = [...element.querySelectorAll("input")];

      const code = inputs.map((el) => el.value).join("");

      await verifyEmail(code);

      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (isVerifying) {
      const code = codeElement.current as HTMLDivElement;
      const inputs = [...code.querySelectorAll("input")];

      const backSpaceHandler = (e: KeyboardEvent) => {
        const target = e.target as HTMLInputElement;
        const ind: number = parseInt(target.classList.toString());
        if (e.key === "Backspace" && target.value === "")
          inputs[Math.max(0, ind - 1)].focus();
      };

      const inputHandler = (e: any) => {
        const target = e.target;
        const ind: number = parseInt(target.classList.toString());

        const [first, ...rest] = target.value;

        target.value = first ?? "";

        const lastInputBox = ind === inputs.length - 1;
        const didInsertContent = first !== undefined;

        if (didInsertContent && !lastInputBox) {
          inputs[ind + 1].focus();
          inputs[ind + 1].value = rest.join("");
          inputs[ind + 1].dispatchEvent(new Event("input"));
        }
      };

      inputs.forEach((el) => {
        el.addEventListener("keydown", backSpaceHandler);
        el.addEventListener("input", inputHandler);
      });

      return () => {
        inputs.forEach((el) => {
          el.removeEventListener("keydown", backSpaceHandler);
          el.removeEventListener("input", inputHandler);
        });
      };
    }
  }, [isVerifying]);

  const timerCallback = () => {
    setIsVerifying(false);
    AlertError("Sorry, you didn't have time to enter the code. Try again.");
  };

  const [shownAPIKey, setShownAPIKey] = useState<boolean>(false);

  const username = useTextInputProps({
    placeholder: "USERNAME",
    className: "flex-1",
    disabled: true,
  });
  const email = useTextInputProps({
    placeholder: "EMAIL",
    className: "flex-1",
    disabled: true,
  });
  const role = useTextInputProps({
    placeholder: "ROLE",
    className: "flex-1",
    disabled: true,
  });
  const api_token = useTextInputProps({
    placeholder: "API KEY",
    className: "flex-1",
    disabled: true,
    isHidden: !shownAPIKey,
  });

  const copyAPIKey = () => {
    navigator.clipboard.writeText(user!.api_token);
    AlertInfo("API Key copied to clipboard.");
  };

  return (
    <>
      {!!user && (
        <div className="settings-container">
          <div className="settings-content">
            <div className="settings-username">
              <TextInput {...username} value={user.username} key="username" />
            </div>

            <div className="settings-email">
              <TextInput {...email} value={user.email} key="email" />
              <CheckBoxInput
                checked={user.is_verified}
                disabled
                key="check_email"
              />
            </div>

            <div className="settings-verification">
              {!user.is_verified && (
                <>
                  {!isVerifying ? (
                    <>
                      <div className="verification-info">
                        {!emailSending ? (
                          <>
                            <div
                              className="verification-action"
                              onClick={sendMail}
                            >
                              Verify Email
                            </div>
                            <div>Email Is Not Verified</div>
                          </>
                        ) : (
                          <div>Sending the code to your email </div>
                        )}
                      </div>
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
                        <input className="0" />
                        <input className="1" />
                        <input className="2" />
                        <input className="3" />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="settings-role">
              <TextInput {...role} value={user.role.toUpperCase()} key="role" />
            </div>
            {user.api_token && (
              <div className="settings-api-key">
                <TextInput {...api_token} value={user.api_token} key="api" />
                <div className="settings-api-key-actions">
                  <div
                    className="settings-api-key-action"
                    onClick={() => setShownAPIKey((prev) => !prev)}
                  >
                    <VisibilityIcon />
                  </div>
                  <div
                    className="settings-api-key-action"
                    onClick={() => {
                      copyAPIKey();
                    }}
                  >
                    <ClipboardCopyIcon />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            className="width-100"
            text={isVerifying ? "VERIFY" : "SAVE"}
            variant={ColorVariant.black}
            onClick={verificationHandler}
            disabled={!isVerifying}
          />
        </div>
      )}
    </>
  );
};

export default SettingsForm;
