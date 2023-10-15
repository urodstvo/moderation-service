import styles from "@/pages/Home/index.module.css"

import { ColorVariant } from "@/interfaces";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button"
import { useAppSelector, usePageTitle } from "@/hooks";

export const Home = () => {
    usePageTitle("CLOUD | HOME PAGE");

    const { isAuth } = useAppSelector(state => state.auth)

    return (
        <>
        <header className={styles.heroContainer}>
            <div className={styles.heroContent}>
                <div className={styles.heroTitle}>
                    WELCOME TO THE <span>CLOUD</span> PLATFORM
                </div>
                
                <div className={styles.heroDescription}>
                    We use advanced artificial intelligence technologies to intelligently analyse and effectively filter user-generated content
                </div>

                <div className={styles.heroActions}>
                    {!isAuth ? (<Link to='?modal=signIn'><Button text='GET STARTED' variant={ColorVariant.black} /></Link>) 
                             : (<Link to='/docs'><Button text='READ DOCS' variant={ColorVariant.black} /></Link>)}
                    <Link to='/services'><Button text='CHECK SERVICES' variant={ColorVariant.white} /></Link>
                </div>
                
            </div>
            <div className={styles.heroImage} />
        </header>
        </>
    );
};

//TODO: ADD RESPONSIVE TO HERO