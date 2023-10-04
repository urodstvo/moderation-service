import { iServicePageHeaderProps } from "@/interfaces";
import { Link } from "react-router-dom";
import ModerationServiceIcon from "./ModerationServiceIcon";

const ServicePageHeader = ({title, description, tab, variant} : iServicePageHeaderProps) => {
    return (
        <div className="page-header-container">
                <div className="page-header-content">
                    <div className="page-header-section">
                        <div className="page-header-wrapper">
                            <h1 className="page-header-title">
                                {title}
                            </h1>
                            <div className="page-header-description">
                                {description.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
                            </div>
                        </div>
                        <div className="page-header-tabs-container">
                            <div className="page-header-tabs-content">
                                <Link to='?tab=info' className={["page-header-tab", tab === "INFO" ? "selected" : ""].join(' ')}>INFO</Link>
                                <Link to='?tab=playground' className={["page-header-tab", tab === "PLAYGROUND" ? "selected" : ""].join(' ')}>PLAYGROUND</Link>
                                <Link to='?tab=integration' className={["page-header-tab", tab === "INTEGRATION" ? "selected" : ""].join(' ')}>INTEGRATION</Link>
                            </div>
                        </div>
                    </div>
                    <div className="page-header-section">
                        <div className="service-card-icon">
                            <ModerationServiceIcon variant={variant}/>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default ServicePageHeader;