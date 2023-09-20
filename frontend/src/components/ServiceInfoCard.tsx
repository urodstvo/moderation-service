import { ReactNode, useRef } from "react";

const ServiceInfoCard = ({icon, title, description} : {icon: ReactNode, title: string, description: string}) => {
    const iconRef = useRef<HTMLDivElement>(null);
    
    return (
        <div className="service-info-card-container"
        // onMouseOver={() => {setTimeout(() => {(iconRef.current as HTMLDivElement).style.display = 'none'}, 400)}}
        // onMouseLeave={() => {setTimeout(() => {(iconRef.current as HTMLDivElement).style.display = 'flex'}, 400)}}
        >
            <div className="service-info-card-content">
                <div className="service-info-card-icon" ref={iconRef}>{icon}</div>
                <div className="service-info-card-title">{title}</div>
                <div className="service-info-card-description">
                    {description.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
                </div>
            </div>
        </div>
    );
};

export default ServiceInfoCard;