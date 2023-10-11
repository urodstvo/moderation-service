import { ReactNode, useRef } from "react";
import styles from './InfoCard.module.css'

export const InfoCard = ({icon, title, description} : {icon: ReactNode, title: string, description: string}) => {
    const iconRef = useRef<HTMLDivElement>(null);
    
    return (
        <div className={styles.infoCardContainer}>
            <div className={styles.infoCardContent}>
                <div className={styles.infoCardIcon} ref={iconRef}>{icon}</div>
                <div className={styles.infoCardTitle} >{title}</div>
                <div className={styles.infoCardDescription}>
                    {description.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
                </div>
            </div>
        </div>
    );
};