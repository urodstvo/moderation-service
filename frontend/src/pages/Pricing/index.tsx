import PricingPlanCard from "@/components/PricingPlanCard";
import styles from "@/pages/Pricing/index.module.css"

const index = () => {
    return (
        <>
        <h1 className="text-center">PRICING</h1>
        <section>
            <div className={styles.plansContainer}>
                <div className={styles.plansContent}>
                    <PricingPlanCard name="STUDENT" price="FREE" offers={["1000 requests per day", "Text Moderation service", "Image Moderation service"]} terms={["Verified Email"]}/>
                    <PricingPlanCard name="COMPANY" price="FREE" offers={["Unlimited requests per day", "Text Moderation service", "Image Moderation service", "Audio Moderation Service", "Video Moderation service"]} terms={["Verified Email", "Admin Approval"]}/>
                </div>
            </div>
        </section>
        </>
    );
};

export default index;