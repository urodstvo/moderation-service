import styles from "@/pages/Home/index.module.css";

import { ColorVariant } from "@/interfaces";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAppSelector, usePageTitle } from "@/hooks";

import { useTranslation, Trans } from "react-i18next";

export const Home = () => {
  usePageTitle("CLOUD | HOME PAGE");

  const { t } = useTranslation();
  const { isAuth } = useAppSelector((state) => state.auth);

  return (
    <>
      <header className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>
            <Trans i18nKey={"home.title"}>
              WELCOME TO THE <span>CLOUD</span> PLATFORM
            </Trans>
          </div>

          <div className={styles.heroDescription}>{t("home.description")}</div>

          <div className={styles.heroActions}>
            {!isAuth ? (
              <Link to="?modal=auth">
                <Button
                  text={t("home.getStarted")}
                  variant={ColorVariant.black}
                />
              </Link>
            ) : (
              <Link to="/docs">
                <Button
                  text={t("home.readDocs")}
                  variant={ColorVariant.black}
                />
              </Link>
            )}
            <Link to="/services">
              <Button
                text={t("home.checkServices")}
                variant={ColorVariant.white}
              />
            </Link>
          </div>
        </div>
        <div className={styles.heroImage} />
      </header>
    </>
  );
};
