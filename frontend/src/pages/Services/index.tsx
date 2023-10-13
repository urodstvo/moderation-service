import { ServiceCard } from "@/pages/Services/components/ServiceCard/ServiceCard";
import { usePageTitle } from "@/hooks";
import { ModerationType } from "@/interfaces";
import styles from "@/pages/Services/index.module.css"

const HeroSky = () => {
    return (
    <div className={styles.heroSky + ' icon'}>
        <svg xmlns="http://www.w3.org/2000/svg" width={290} height={160} viewBox="0 0 294 160" fill="none">
        <path d="M73.6667 160C53.4444 160 36.1644 154.75 21.8267 144.25C7.48888 133.75 0.324432 120.917 0.333321 105.75C0.333321 92.75 5.55554 81.1667 16 71C26.4444 60.8333 40.1111 54.3333 57 51.5C62.5556 36.1667 73.6667 23.75 90.3333 14.25C107 4.75 125.889 0 147 0C173 0 195.058 6.79333 213.173 20.38C231.289 33.9667 240.342 50.5067 240.333 70C255.667 71.3333 268.391 76.2933 278.507 84.88C288.622 93.4667 293.676 103.507 293.667 115C293.667 127.5 287.831 138.127 276.16 146.88C264.489 155.633 250.324 160.007 233.667 160H73.6667Z" fill="white" style={{mixBlendMode: 'difference'}}/>
        </svg>
    </div>
    )
}

const HeroRobot = () => {
    return (
        <div className={styles.heroRobot + ' icon'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
            <path d="M89.2 96.2667L96.2667 103.333L89.2 110.4L96.2667 117.467L103.333 110.4L110.4 117.467L117.467 110.4L110.4 103.333L117.467 96.2667L110.4 89.2L103.333 96.2667L96.2667 89.2L89.2 96.2667ZM49.6 89.2L56.6667 96.2667L63.7334 89.2L70.8 96.2667L63.7334 103.333L70.8 110.4L63.7334 117.467L56.6667 110.4L49.6 117.467L42.5334 110.4L49.6 103.333L42.5334 96.2667L49.6 89.2ZM6.6667 100V120C6.6667 123.667 9.6667 126.667 13.3334 126.667H20V133.333C20 140.733 25.9334 146.667 33.3334 146.667H126.667C130.203 146.667 133.594 145.262 136.095 142.761C138.595 140.261 140 136.87 140 133.333V126.667H146.667C150.333 126.667 153.333 123.667 153.333 120V100C153.333 96.3333 150.333 93.3333 146.667 93.3333H140C140 67.5333 119.133 46.6667 93.3334 46.6667H86.6667V38.2C90.6667 35.9333 93.3334 31.6 93.3334 26.6667C93.3334 19.3333 87.3334 13.3333 80 13.3333C72.6667 13.3333 66.6667 19.3333 66.6667 26.6667C66.6667 31.6 69.3334 35.9333 73.3334 38.2V46.6667H66.6667C40.8667 46.6667 20 67.5333 20 93.3333H13.3334C9.6667 93.3333 6.6667 96.3333 6.6667 100ZM20 106.667H33.3334V93.3333C33.3334 74.9333 48.2667 60 66.6667 60H93.3334C111.733 60 126.667 74.9333 126.667 93.3333V106.667H140V113.333H126.667V133.333H33.3334V113.333H20V106.667Z" fill="white" style={{mixBlendMode: 'difference'}}/>
            </svg>
        </div>
    )
}

export const Services = () => {
    usePageTitle('SERVICES PAGE | CLOUD');

    return (
        <>
        <section className={styles.heroContainer}>
            <div className={styles.heroContent}>
                <div className={styles.heroTitle}>
                    AI oriented services on a cloud platform
                </div>
                <div className={styles.heroImage}>
                    <HeroSky  />
                    <HeroSky  />
                    <HeroSky  />
                    <HeroSky  />
                    <HeroSky  />
                    <HeroRobot />
                </div>
            </div>
        </section>
        <section>
            <h2>SERVICES</h2>
            <div className={styles.servicesList}>
                <ServiceCard path="/services/text-moderation" title='Text Moderation' description="Text information moderation service" variant={ModerationType.text} />
                <ServiceCard path="/services/image-moderation" title='Image Moderation' description="Image content moderation service" variant={ModerationType.image} disabled/>
                <ServiceCard path="/services/audio-moderation" title='Audio Moderation' description="Audio record moderation service" variant={ModerationType.audio} disabled/>
                <ServiceCard path="/services/video-moderation" title='Video Moderation' description="Video content moderation service" variant={ModerationType.video} disabled/>
            </div>
        </section>
        </>
    );
};