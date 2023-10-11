import styles from "./PlanCard.module.css"
import { ColorVariant, iPricingCardProps } from "@/interfaces";
import Button from "@/components/ui/Button";

export const PlanCard = ({name, price, offers, terms } : iPricingCardProps) => {
    return (
        <div className={styles.pricingCardContainer}>
            <div className={styles.pricingCardContent}>
                <div className={styles.pricingCardHeader}>
                    <div className={styles.pricingCardName}>{name}</div>
                    <div className={styles.pricingCardPrice}>{price}</div>
                </div>
                <ul className={styles.pricingCardOffers}>
                    {offers.map((text, ind) => <li key={ind} className={styles.pricingCardOffer}>{text}</li>)}
                </ul>
                <ul className={styles.pricingCardTerms}>
                    <div className={styles.pricingCardTermsTitle}>TERMS</div>
                    {terms.map((text, ind) => <li key={ind} className={styles.pricingCardTerm}>{text}</li>)}
                </ul>
                <div className={styles.pricingCardButton}>
                    <Button className="fill-container" text="CHOOSE PLAN" variant={ColorVariant.white} />
                </div>
            </div>
        </div>
    );
};

// TODO: Add func if use not authed, user not verified and etc.