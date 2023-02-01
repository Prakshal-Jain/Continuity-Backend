import styles from '../styles/hero.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons'

type ScrollProps = {
    h1Ref: React.RefObject<HTMLDivElement>,
    h2Ref: React.RefObject<HTMLDivElement>,
    h3Ref: React.RefObject<HTMLDivElement>,
}

export default function Hero({ h1Ref, h2Ref, h3Ref }: ScrollProps) {
    return (
        <main className={styles.main}>
            <Image
                src="/images/logo-dark.png" // Route of the image file
                height={100} // Desired size with correct aspect ratio
                width={100} // Desired size with correct aspect ratio
                alt="Continuity Logo"
                className={styles.logo_img}
            />
            <video autoPlay={true} muted={true} loop={true} className={styles.video_player}>
                <source src="videos/hero_video.mp4" type="video/mp4" />
            </video>

            <div>
                <div className={styles.subtitle}>
                    <div className={styles.heading} onClick={() => h1Ref?.current?.scrollIntoView({ behavior: 'smooth' })}>Seamless</div>
                    <FontAwesomeIcon icon={faCircle} className={styles.dot} />
                    <div className={styles.heading} onClick={() => h2Ref?.current?.scrollIntoView({ behavior: 'smooth' })}>Secure</div>
                    <FontAwesomeIcon icon={faCircle} className={styles.dot} />
                    <div className={styles.heading} onClick={() => h3Ref?.current?.scrollIntoView({ behavior: 'smooth' })}>Productive</div>
                </div>
                <div className={styles.h2}>
                    Web Browser
                </div>
            </div>
        </main>
    )
}