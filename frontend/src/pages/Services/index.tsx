import ServiceCard from "@/components/ServiceCard";
import { ModerationType } from "@/interfaces";
import styles from "@/pages/Services/index.module.css"

const Services = () => {
    document.title = 'SERVICES PAGE | CLOUD'

    // console.log(styles)
    return (
        <>
        <section className={styles.heroContainer}>
            <div className={styles.heroContent}>
                <div className={styles.heroTitle}>
                    AI oriented services on a cloud platform
                </div>
                <div className={styles.heroImage}>
                    <div className={styles.heroSky}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="294" height="160" viewBox="0 0 294 160" fill="none">
                        <path d="M73.6667 160C53.4444 160 36.1644 154.75 21.8267 144.25C7.48888 133.75 0.324432 120.917 0.333321 105.75C0.333321 92.75 5.55554 81.1667 16 71C26.4444 60.8333 40.1111 54.3333 57 51.5C62.5556 36.1667 73.6667 23.75 90.3333 14.25C107 4.75 125.889 0 147 0C173 0 195.058 6.79333 213.173 20.38C231.289 33.9667 240.342 50.5067 240.333 70C255.667 71.3333 268.391 76.2933 278.507 84.88C288.622 93.4667 293.676 103.507 293.667 115C293.667 127.5 287.831 138.127 276.16 146.88C264.489 155.633 250.324 160.007 233.667 160H73.6667Z" fill="white" style={{mixBlendMode: 'difference'}}/>
                        </svg>
                    </div>
                    <div className={styles.heroSky}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="299" height="164" viewBox="0 0 299 164" fill="none">
                            <path d="M223.979 163.333C244.517 163.333 262.067 157.996 276.629 147.321C291.191 136.646 298.467 123.599 298.458 108.179C298.458 94.9625 293.155 83.1861 282.547 72.85C271.939 62.5139 258.059 55.9055 240.906 53.025C235.264 37.4361 223.979 24.8125 207.052 15.1542C190.125 5.49583 170.941 0.666656 149.5 0.666656C123.094 0.666656 100.691 7.57321 82.2927 21.3863C63.8941 35.1994 54.6993 52.0151 54.7083 71.8333C39.1354 73.1889 26.2121 78.2315 15.9385 86.9613C5.66492 95.6911 0.532623 105.898 0.541656 117.583C0.541656 130.292 6.46838 141.095 18.3219 149.995C30.1754 158.894 44.5611 163.34 61.4792 163.333H223.979Z" fill="white" fillOpacity="0.85" style={{mixBlendMode: 'difference'}}/>
                        </svg>
                    </div>
                    <div className={styles.heroSky}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="294" height="81" viewBox="0 0 294 81" fill="none">
                        <path d="M73.6667 81C53.4445 81 36.1645 75.75 21.8267 65.25C7.48894 54.75 0.324493 41.9167 0.333382 26.75C0.333382 13.75 5.5556 2.16667 16.0001 -8C26.4445 -18.1667 40.1112 -24.6667 57.0001 -27.5C62.5556 -42.8333 73.6667 -55.25 90.3334 -64.75C107 -74.25 125.889 -79 147 -79C173 -79 195.058 -72.2067 213.173 -58.62C231.289 -45.0333 240.342 -28.4933 240.333 -9C255.667 -7.66666 268.391 -2.70667 278.507 5.88C288.622 14.4667 293.676 24.5067 293.667 36C293.667 48.5 287.831 59.1267 276.16 67.88C264.489 76.6333 250.325 81.0067 233.667 81H73.6667Z" fill="white" fillOpacity="0.95" style={{mixBlendMode: 'difference'}}/>
                        </svg>
                    </div>
                    <div className={styles.heroSky}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="294" height="118" viewBox="0 0 294 118" fill="none">
                        <path d="M73.6667 160C53.4445 160 36.1645 154.75 21.8267 144.25C7.48894 133.75 0.324493 120.917 0.333382 105.75C0.333382 92.75 5.5556 81.1667 16.0001 71C26.4445 60.8333 40.1112 54.3333 57.0001 51.5C62.5556 36.1667 73.6667 23.75 90.3334 14.25C107 4.75 125.889 0 147 0C173 0 195.058 6.79333 213.173 20.38C231.289 33.9667 240.342 50.5067 240.333 70C255.667 71.3333 268.391 76.2933 278.507 84.88C288.622 93.4667 293.676 103.507 293.667 115C293.667 127.5 287.831 138.127 276.16 146.88C264.489 155.633 250.325 160.007 233.667 160H73.6667Z" fill="white" fillOpacity="0.9" style={{mixBlendMode: 'difference'}}/>
                        </svg>
                    </div>
                    <div className={styles.heroSky}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="294" height="160" viewBox="0 0 294 160" fill="none">
                        <path d="M220.333 160C240.556 160 257.836 154.75 272.173 144.25C286.511 133.75 293.676 120.917 293.667 105.75C293.667 92.75 288.445 81.1667 278 71C267.556 60.8333 253.889 54.3333 237 51.5C231.445 36.1667 220.333 23.75 203.667 14.25C187 4.75 168.111 0 147 0C121 0 98.9423 6.79333 80.8267 20.38C62.7112 33.9667 53.6578 50.5067 53.6667 70C38.3334 71.3333 25.6089 76.2933 15.4933 84.88C5.37778 93.4667 0.324463 103.507 0.333374 115C0.333374 127.5 6.16891 138.127 17.84 146.88C29.5111 155.633 43.6756 160.007 60.3334 160H220.333Z" fill="white" fillOpacity="0.95" style={{mixBlendMode: 'difference'}}/>
                        </svg>
                    </div>
                    <div className={styles.heroRobot}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
                        <path d="M89.2 96.2667L96.2667 103.333L89.2 110.4L96.2667 117.467L103.333 110.4L110.4 117.467L117.467 110.4L110.4 103.333L117.467 96.2667L110.4 89.2L103.333 96.2667L96.2667 89.2L89.2 96.2667ZM49.6 89.2L56.6667 96.2667L63.7334 89.2L70.8 96.2667L63.7334 103.333L70.8 110.4L63.7334 117.467L56.6667 110.4L49.6 117.467L42.5334 110.4L49.6 103.333L42.5334 96.2667L49.6 89.2ZM6.6667 100V120C6.6667 123.667 9.6667 126.667 13.3334 126.667H20V133.333C20 140.733 25.9334 146.667 33.3334 146.667H126.667C130.203 146.667 133.594 145.262 136.095 142.761C138.595 140.261 140 136.87 140 133.333V126.667H146.667C150.333 126.667 153.333 123.667 153.333 120V100C153.333 96.3333 150.333 93.3333 146.667 93.3333H140C140 67.5333 119.133 46.6667 93.3334 46.6667H86.6667V38.2C90.6667 35.9333 93.3334 31.6 93.3334 26.6667C93.3334 19.3333 87.3334 13.3333 80 13.3333C72.6667 13.3333 66.6667 19.3333 66.6667 26.6667C66.6667 31.6 69.3334 35.9333 73.3334 38.2V46.6667H66.6667C40.8667 46.6667 20 67.5333 20 93.3333H13.3334C9.6667 93.3333 6.6667 96.3333 6.6667 100ZM20 106.667H33.3334V93.3333C33.3334 74.9333 48.2667 60 66.6667 60H93.3334C111.733 60 126.667 74.9333 126.667 93.3333V106.667H140V113.333H126.667V133.333H33.3334V113.333H20V106.667Z" fill="white" style={{mixBlendMode: 'difference'}}/>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <h2>SERVICES</h2>
            <div className={styles.servicesList}>
                <ServiceCard path="/services/text-moderation" title='Text Moderation' description="Text information moderation service" variant={ModerationType.text} />
                <ServiceCard path="/services/image-moderation" title='Image Moderation' description="Image content moderation service" variant={ModerationType.image} />
                <ServiceCard path="/services/audio-moderation" title='Audio Moderation' description="Audio record moderation service" variant={ModerationType.audio} />
                <ServiceCard path="/services/video-moderation" title='Video Moderation' description="Video content moderation service" variant={ModerationType.video} />
            </div>
        </section>
        </>
    );
};

export default Services;