import { iServiceCardProps } from "@/interfaces";
import { memo } from "react";
import { Link } from "react-router-dom";
import ModerationServiceIcon from "./ModerationServiceIcon";

const ServiceCard = memo(({title, description, variant, path, disabled = false} : iServiceCardProps) => {
    return (
        <div className="service-card-container">
            <div className="service-card-content">
                <div className="service-card-icon">
                    <ModerationServiceIcon variant={variant} />
                </div>
                <div className="service-card-info">
                    <div className="service-card-header">
                        <div className="service-card-title">
                            {title}
                        </div>
                        <div className="service-card-description">
                            {description}
                        </div>
                    </div>
                    <div className="service-card-links">
                    {!disabled ? (
                        <>
                        <Link to={path + "?tab=playground"} className="service-card-link">Playground</Link>
                        <Link to={path + "?tab=info"}  className="service-card-link">Info</Link>
                        <Link to={path + "?tab=integration"}  className="service-card-link">Get API Key</Link>
                        </>
                    ) : (
                        <div className="service-card-link">Coming Soon</div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ServiceCard;