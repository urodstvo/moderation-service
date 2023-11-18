import { Link, Outlet, useLocation } from "react-router-dom";
import { ModPageTab, ModerationType } from "@/interfaces";
import { usePageTitle } from "@/hooks";

import { ModTypeIcon } from "@/components/icon/ModTypeIcon";

import stylesHeader from "@/pages/Moderation/styles/PageHeader.module.css";
import stylesLayout from "@/pages/Moderation/styles/PageContentLayout.module.css";

export const Moderation = () => {
  usePageTitle("MODERATION SERVICE PAGE");

  const { pathname } = useLocation();
  const tab = pathname.split("/")[3];

  const header = {
    tab: tab.toUpperCase() as ModPageTab,
    title: "MODERATION SERVICE",
    description: `A powerful text content moderation tool that provides options for safe and effective content control and management. 
            The service is based on advanced algorithms and machine learning technologies that allow us to automatically detect and classify different types of unwanted content, categorising it into 6 main classes: toxicity, excessive toxicity, threats, personal hatred, insults and non-protest.
            One of the key features of our service is the ability to integrate using APIs. This means you can easily integrate our moderation system into your application. `,
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
                  INFO
                </Link>
                <Link
                  to="/services/moderation/playground/text"
                  className={[
                    stylesHeader.pageHeaderTab,
                    header.tab === "PLAYGROUND" ? stylesHeader.selected : "",
                  ].join(" ")}
                >
                  PLAYGROUND
                </Link>
                <Link
                  to="/services/moderation/integration"
                  className={[
                    stylesHeader.pageHeaderTab,
                    header.tab === "INTEGRATION" ? stylesHeader.selected : "",
                  ].join(" ")}
                >
                  INTEGRATION
                </Link>
              </div>
            </div>
          </div>
          <div className={stylesHeader.pageHeaderSection}>
            <div>
              <ModTypeIcon variant={ModerationType.text} />
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
