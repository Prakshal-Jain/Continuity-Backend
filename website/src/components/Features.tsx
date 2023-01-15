import styles from '../styles/features.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay, faAppStore, faChrome } from '@fortawesome/free-brands-svg-icons'
import { feaures } from "../data/features";
import Tile, { Props } from './Tile';
import React from 'react';

type ScrollProps = {
    scrollTarget: React.RefObject<HTMLDivElement>
}

export default function Features({ scrollTarget }: ScrollProps) {
    return (
        <main className={styles.main}>
            <div>
                <div className={styles.download_options} ref={scrollTarget} id="download">Download for free on</div>
                <div className={styles.download_icons}>
                    <a href="https://forms.gle/4pfVmUYMcNq5UfSX7" target="_blank">
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faGooglePlay} className={`${styles.playstore} ${styles.scale}`} />
                            <div className={styles.description}>Google Playstore</div>
                        </div>
                    </a>

                    <a href="https://forms.gle/4pfVmUYMcNq5UfSX7" target="_blank">
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faAppStore} className={`${styles.appstore} ${styles.scale}`} />
                            <div className={styles.description}>Apple AppStore</div>
                        </div>
                    </a>

                    <a href="https://forms.gle/4pfVmUYMcNq5UfSX7" target="_blank">
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faChrome} className={`${styles.chrome} ${styles.scale}`} />
                            <div className={styles.description}>Chrome Extension</div>
                        </div>
                    </a>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.title}>Features</div>
                {feaures.map((props: Props) => <Tile {...props} />)}
            </div>

            <div className={styles.subheading}>
                And much more coming soon...
            </div>
        </main>
    )
}