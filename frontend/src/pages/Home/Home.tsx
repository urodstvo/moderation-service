import styles from "@/pages/Home/home.module.css"

import { variants } from "@/interfaces";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button"

const Home = () => {
    document.title = "CLOUD | HOME PAGE";

    return (
        <>
        <div className="hero-container home-page">
            <div className="hero-content">
                <div className="hero-title">
                    WELCOME TO THE <span>CLOUD</span> PLATFORM
                </div>
                
                <div className="hero-description">
                    Lorem ipsum dolor sit amet consectetur. Netus tortor tortor facilisis ut. Vulputate turpis auctor tempor amet purus non id gravida odio. 
                </div>

                <div className="hero-actions">
                    <Button text='GET STARTED' variant={variants.black}/>
                    <Link to='/services'><Button text='CHECK SERVICES' variant={variants.white} /></Link>
                </div>
                
                <div className="hero-image" />
            </div>
        </div>
        </>
    );
};

export default Home;