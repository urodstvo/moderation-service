import { ReactNode } from "react";
import styles from "./PageContentLayout.module.css"

export const PageContentLayout = ({children} : {children: ReactNode}) => {
    return (
        <div className={styles.pageContentContainer}>
            <div className={styles.pageContentContent}>
                {children}
            </div>
        </div>
    );
};