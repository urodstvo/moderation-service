import { useAppSelector } from "@/hooks";
import Modal from "./Modal";
import { useSearchParams } from "react-router-dom";
import AuthForm from "./AuthForm/AuthForm";
import SettingsForm from "./SettingsForm";
import { useEffect } from "react";

const ModalContainer = () => {
  const [searchParams, SetSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user)
      SetSearchParams((prev) => prev.toString().replace("modal=signIn", ""));
  }, [user]);

  const modal = searchParams.get("modal");
  if (!user && modal === "signIn")
    return (
      <Modal>
        <AuthForm />
      </Modal>
    );

  if (user && modal === "settings")
    return (
      <Modal>
        <SettingsForm />
      </Modal>
    );

  if (user && modal === "notification")
    return (
      <Modal>
        <div>notifications</div>
      </Modal>
    );
};

export default ModalContainer;
