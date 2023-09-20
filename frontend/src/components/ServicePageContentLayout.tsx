import { ReactNode } from "react";

const ServicePageContentLayout = ({children} : {children: ReactNode}) => {
    return (
        <div className="page-content-container">
            <div className="page-content-content">
                {children}
            </div>
        </div>
    );
};

export default ServicePageContentLayout;