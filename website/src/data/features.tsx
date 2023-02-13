import styles from '../styles/tile.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

export const features = [
    {
        title: "Kick off here, wrap up there",
        description: (
            <>
                <div>
                    Imagine the convenience of having all your tabs seamlessly synced across multiple devices in real-time with Continuity. No more need to manually transfer tabs or waste time searching for the one you were just on. Continuity allows for effortless access to your open tabs on any device, whether you&apos;re on your desktop or on-the-go with your mobile phone.
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <Link href="/sync_tutorial" className={styles.link} target="_blank">
                        Learn how to sync tabs across multiple devices <FontAwesomeIcon icon={faExternalLink} className={styles.link} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>
            </>
        ),
        video: (
            <video autoPlay={true} muted={true} loop={true} style={{ width: '100%', borderRadius: '15px' }}>
                <source src="videos/sync.mp4" type="video/mp4" />
            </video>
        ),
        extraWidth: true
    },
    {
        title: "Built with your privacy in mind",
        description: "Continuity offers comprehensive and intelligent Privacy Reports and Tracking Protection features to protect you from the websites and services that may collect your personal information. Unlike other browsers that rely on add-on extensions to provide similar functionality, Continuity's tracking protection is deeply integrated into the browser and ensures that data is securely shared between devices without the risk of third-party access. This sets Continuity apart from other browsers and makes it a game-changing choice for users who value privacy and security.",
        video: (
            <video autoPlay={true} muted={true} loop={true} className={styles.video_border}>
                <source src="videos/privacy.mp4" type="video/mp4" />
            </video>
        )
    },
    {
        title: "Ultra Search",
        description: "With Ultra Search, you can find exactly what you're looking for in no time. The AI-generated suggestions are custom tailored to your specific needs, making it easier than ever to find the information you need. And for the first time ever, Ultra Search is seamlessly integrated into your web browser, making it a powerful tool for all of your online searches.",
        video: (
            <video autoPlay={true} muted={true} loop={true} className={styles.video_border}>
                <source src="videos/ultrasearch.mp4" type="video/mp4" />
            </video>
        )
    },
]