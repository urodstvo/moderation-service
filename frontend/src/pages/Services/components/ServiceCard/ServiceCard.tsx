import { iServiceCardProps } from "@/interfaces";
import { memo } from "react";
import { Link } from "react-router-dom";
import { ModTypeIcon } from "../../../../components/icon/ModTypeIcon";
import styles from "./ServiceCard.module.css"

export const ServiceCard = memo(({title, description, variant, path, disabled = false} : iServiceCardProps) => {
    return (
        <Link to={disabled ? '' : path} >
            <div className={[styles.serviceCardContainer, !!disabled && styles.disabled].join(' ')}>
                <div className={styles.serviceCardContent}>
                    <div className={styles.serviceCardIcon + ' icon'}>
                        <ModTypeIcon variant={variant} />
                    </div>
                    <div className={styles.serviceCardInfo}>
                        <div className={styles.serviceCardHeader}>
                            <div className={styles.serviceCardTitle}>
                                {title}
                            </div>
                            <div className={styles.serviceCardDescription}>
                                {description}
                            </div>
                        </div>
                        {disabled && (<div className={styles.serviceCardNotion}>Coming Soon</div>)}
                    </div>
                </div>
            </div>
        </Link>
    );
});
