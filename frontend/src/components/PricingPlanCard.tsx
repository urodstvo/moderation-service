import { ColorVariant, iPricingCardProps } from "@/interfaces";
import Button from "./ui/Button";

const PricingPlanCard = ({name, price, offers, terms } : iPricingCardProps) => {
    return (
        <div className="pricing-card-container">
            <div className="pricing-card-content">
                <div className="pricing-card-header">
                    <div className="pricing-card-name">{name}</div>
                    <div className="pricing-card-price">{price}</div>
                </div>
                <ul className="pricing-card-offers">
                    {offers.map((text, ind) => <li key={ind} className="pricing-card-offer">{text}</li>)}
                </ul>
                <ul className="pricing-card-terms">
                    <div className="pricing-card-terms-title">TERMS</div>
                    {terms.map((text, ind) => <li key={ind} className="pricing-card-term">{text}</li>)}
                </ul>
                <div className="pricing-card-button">
                    <Button className="fill-container" text="CHOOSE PLAN" variant={ColorVariant.white} />
                </div>
            </div>
        </div>
    );
};

export default PricingPlanCard;