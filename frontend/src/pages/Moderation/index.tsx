import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ModPageTab, ModerationType } from "@/interfaces";
import { usePageTitle } from "@/hooks";

import { ModTypeIcon } from "@/components/icon/ModTypeIcon";

import stylesHeader from "@/pages/Moderation/styles/PageHeader.module.css";
import stylesLayout from "@/pages/Moderation/styles/PageContentLayout.module.css";
import { useTranslation } from "react-i18next";

export const Moderation = () => {
  const { t } = useTranslation();
  usePageTitle("MODERATION SERVICE PAGE");

  const { type } = useParams();
  const { pathname } = useLocation();
  const tab = pathname.split("/")[3];

  const header = {
    tab: tab.toUpperCase() as ModPageTab,
    title: t("services.moderationService.title"),
    description: t("services.moderationService.description"),
    variant: ModerationType.text,
  };

  return (
    <>
      <div className={stylesHeader.pageHeaderContainer}>
        <div className={stylesHeader.pageHeaderContent}>
          <div className={stylesHeader.pageHeaderSection}>
            <div className={stylesHeader.pageHeaderWrapper}>
              <h1 className={stylesHeader.pageHeaderTitle}>{header.title}</h1>
              <div className={stylesHeader.pageHeaderDescription}>
                {header.description?.split("\n").map((text, ind) => (
                  <p key={ind}>{text}</p>
                ))}
              </div>
            </div>
            <div className={stylesHeader.pageHeaderTabsContainer}>
              <div className={stylesHeader.pageHeaderTabsContent}>
                <Link
                  to="/services/moderation/info"
                  className={[
                    stylesHeader.pageHeaderTab,
                    header.tab === "INFO" ? stylesHeader.selected : "",
                  ].join(" ")}
                >
                  {t("services.moderationService.info")}
                </Link>
                <Link
                  to="/services/moderation/playground/text"
                  className={[
                    stylesHeader.pageHeaderTab,
                    header.tab === "PLAYGROUND" ? stylesHeader.selected : "",
                  ].join(" ")}
                >
                  {t("services.moderationService.playground")}
                </Link>
                <Link
                  to="/services/moderation/integration"
                  className={[
                    stylesHeader.pageHeaderTab,
                    header.tab === "INTEGRATION" ? stylesHeader.selected : "",
                  ].join(" ")}
                >
                  {t("services.moderationService.integration")}
                </Link>
              </div>
            </div>
          </div>
          <div className={stylesHeader.pageHeaderSection}>
            <div>
              <ModTypeIcon
                variant={(type as ModerationType) ?? ModerationType.text}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={stylesLayout.pageContentContainer}>
        <div className={stylesLayout.pageContentContent}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
