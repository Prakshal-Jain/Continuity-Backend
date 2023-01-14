import styles from '../styles/hero.module.css';
import Image from 'next/image';

export default function Hero() {
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
            <div className={styles.heading}>
                Seamless . Secure . Productive
            </div>

            <div>
                Learn More
            </div>
        </main>
    )
}