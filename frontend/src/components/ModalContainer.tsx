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
      SetSearchParams((prev) => prev.toString().replace("modal=auth", ""));
  }, [user]);

  const modal = searchParams.get("modal");
  if (user) {
    switch (modal) {
      case "notification":
        return (
          <Modal>
            <div>notifications</div>
          </Modal>
        );
      case "settings":
        return (
          <Modal>
            <SettingsForm />
          </Modal>
        );
    }
  } else {
    if (modal === "auth")
      return (
        <Modal>
          <AuthForm />
        </Modal>
      );
  }
};

export default ModalContainer;
