import { usePageTitle } from "@/hooks";
import styles from "@/pages/Docs/index.module.css";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import GetStarted from "./Tabs/GetStarted";
import RestApi from "./Tabs/RestApi";

export const Docs = () => {
  usePageTitle("DOCS PAGE | CLOUD");

  const [selectedTab, setSelectedTab] = useState<number>(1);

  const list = useRef<HTMLDivElement>(null);

  const openGroup: MouseEventHandler = (e) => {
    (e.currentTarget as HTMLDivElement)
      .closest("." + styles.sidebarListContainer)
      ?.classList.toggle(styles.opened);
  };

  const changeTab: MouseEventHandler = (e) => {
    const selectedTab = (e.currentTarget as HTMLDivElement).dataset.tab;
    setSelectedTab(parseInt(selectedTab as string));
  };

  useEffect(() => {
    const tabs = (list.current as HTMLDivElement).querySelectorAll(
      "[data-tab]"
    );
    tabs.forEach((element) => {
      element.classList.remove(styles.sidebarTabSelected);
    });

    (list.current as HTMLDivElement)
      .querySelector(`[data-tab="${selectedTab}"]`)
      ?.classList.add(styles.sidebarTabSelected);
  }, [selectedTab]);

  const Tabs = [<GetStarted />, <RestApi />];

  return (
    <>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarContent} ref={list}>
          <div className={styles.sidebarTab} data-tab={1} onClick={changeTab}>
            Getting started
          </div>
          <div className={styles.sidebarTab} data-tab={2} onClick={changeTab}>
            REST API
          </div>
          {/* <div className={styles.sidebarListContainer}>
                    <div className={styles.sidebarTab} onClick={openGroup}>Endpoints</div>
                    <div className={styles.sidebarListContent}>                        
                        <div className={styles.sidebarTab} data-tab={3} onClick={changeTab}>Text Moderation</div>
                    </div>
                </div> */}
          <div className={styles.sidebarTab} data-tab={3} onClick={changeTab}>
            FAQ
          </div>
        </div>
      </div>

      <div className={styles.docsContainer}>
        <div className={styles.docsContent}>{Tabs[selectedTab - 1]}</div>
      </div>
    </>
  );
};
