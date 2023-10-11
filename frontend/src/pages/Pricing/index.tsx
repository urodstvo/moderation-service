import { PlanCard } from "@/pages/Pricing/components/PlanCard/PlanCard";
import styles from "@/pages/Pricing/index.module.css"

export const Pricing = () => {
    return (
        <>
        <h1 className="text-center">PRICING</h1>
        <section>
            <div className={styles.plansContainer}>
                <div className={styles.plansContent}>
                    <PlanCard name="STUDENT" price="FREE" offers={["1000 requests per day", "Text Moderation service", "Image Moderation service"]} terms={["Verified Email"]}/>
                    <PlanCard name="COMPANY" price="FREE" offers={["Unlimited requests per day", "Text Moderation service", "Image Moderation service", "Audio Moderation Service", "Video Moderation service"]} terms={["Verified Email", "Admin Approval"]}/>
                </div>
            </div>
        </section>
        </>
    );
};