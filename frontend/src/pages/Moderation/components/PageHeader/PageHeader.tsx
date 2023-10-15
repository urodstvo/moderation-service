import { iServicePageHeaderProps } from "@/interfaces";
import { Link } from "react-router-dom";
import { ModTypeIcon } from "@/components/icon/ModTypeIcon";
import styles from "./PageHeader.module.css"

export const PageHeader = ({title, description, tab, variant} : iServicePageHeaderProps) => {
    description = `A powerful text content moderation tool that provides options for safe and effective content control and management. 
    The service is based on advanced algorithms and machine learning technologies that allow us to automatically detect and classify different types of unwanted content, categorising it into 6 main classes: toxicity, excessive toxicity, threats, personal hatred, insults and non-protest.
    One of the key features of our service is the ability to integrate using APIs. This means you can easily integrate our moderation system into your application. `
    
    return (
        <div className={styles.pageHeaderContainer}>
                <div className={styles.pageHeaderContent}>
                    <div className={styles.pageHeaderSection}>
                        <div className={styles.pageHeaderWrapper}>
                            <h1 className={styles.pageHeaderTitle}>
                                {title}
                            </h1>
                            <div className={styles.pageHeaderDescription}>
                                {description.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
                            </div>
                        </div>
                        <div className={styles.pageHeaderTabsContainer}>
                            <div className={styles.pageHeaderTabsContent}>
                                <Link to=''                 className={[styles.pageHeaderTab, tab === "INFO" ? styles.selected : ""].join(' ')}>INFO</Link>
                                <Link to='?tab=playground'  className={[styles.pageHeaderTab, tab === "PLAYGROUND" ?  styles.selected : ""].join(' ')}>PLAYGROUND</Link>
                                <Link to='?tab=integration' className={[styles.pageHeaderTab, tab === "INTEGRATION" ?  styles.selected : ""].join(' ')}>INTEGRATION</Link>
                            </div>
                        </div>
                    </div>
                    <div className={styles.pageHeaderSection}>
                        <div><ModTypeIcon variant={variant}/></div>
                    </div>
                </div>
            </div>
    );
};
