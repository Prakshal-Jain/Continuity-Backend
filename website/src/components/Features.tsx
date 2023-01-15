import styles from '../styles/features.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay, faAppStore, faChrome } from '@fortawesome/free-brands-svg-icons'
import { feaures } from "../data/features";
import Tile, { Props } from './Tile';

type ScrollProps = {
    scrollTarget: React.RefObject<HTMLDivElement>
}

export default function Features({ scrollTarget }: ScrollProps) {
    return (
        <main className={styles.main}>
            <div>
                <div className={styles.download_options} ref={scrollTarget}>Download for free on</div>
                <div className={styles.download_icons}>
                    <div style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faGooglePlay} className={`${styles.playstore} ${styles.scale}`} />
                        <div className={styles.description}>Google Playstore</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faAppStore} className={`${styles.appstore} ${styles.scale}`} />
                        <div className={styles.description}>Apple AppStore</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faChrome} className={`${styles.chrome} ${styles.scale}`} />
                        <div className={styles.description}>Chrome Extension</div>
                    </div>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.title}>Features</div>
                {feaures.map((props: Props) => <Tile {...props} />)}
            </div>
        </main>
    )
}