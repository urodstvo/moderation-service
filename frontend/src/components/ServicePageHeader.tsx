import { ModerationType, iServicePageHeaderProps } from "@/interfaces";
import { Link } from "react-router-dom";

const ServicePageHeader = ({title, description, tab, variant} : iServicePageHeaderProps) => {
   
    let icon;
    switch (variant){
        case ModerationType.text:
        {
            icon = (
                <div className="service-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 20V7H2V4H15V7H10V20H7ZM16 20V12H13V9H22V12H19V20H16Z" />
                    </svg>
                </div>
            );
            break;
        }
        case ModerationType.image:
        {
            icon = (
                <div className="service-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24"/>
                    <path d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z"/>
                    </svg>
                </div>
            );
            break;
        }
        case ModerationType.audio:
        {
            icon = (
                <div className="service-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 18V6H9V18H7ZM11 22V2H13V22H11ZM3 14V10H5V14H3ZM15 18V6H17V18H15ZM19 14V10H21V14H19Z"/>
                    </svg>
                </div>
            );
            break;
        }
        case ModerationType.video:
        {
            icon = (
                <div className="service-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.5 16.5L16.5 12L9.5 7.5V16.5ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"/>
                    </svg>
                </div>
            );
            break;
        }
    }

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
                        {icon}
                    </div>
                </div>
            </div>
    );
};

export default ServicePageHeader;