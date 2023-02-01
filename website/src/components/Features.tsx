import styles from '../styles/features.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay, faAppStore, faChrome } from '@fortawesome/free-brands-svg-icons'
import { features } from "../data/features";
import Tile, { Props } from './Tile';
import React from 'react';
import MoreFeatures from './MoreFeatures';

type ScrollProps = {
    scrollTarget: React.RefObject<HTMLDivElement>,
    h1Ref: React.RefObject<HTMLDivElement>,
    h2Ref: React.RefObject<HTMLDivElement>,
    h3Ref: React.RefObject<HTMLDivElement>,
}

export default function Features({ scrollTarget, h1Ref, h2Ref, h3Ref }: ScrollProps) {
    return (
        <main className={styles.main}>
            <div>
                <div className={styles.download_options} ref={scrollTarget} id="download">Download for free on</div>
                <div className={styles.download_icons}>
                    <a href="https://discord.gg/TwJ863WJsQ" target="_blank" rel="noreferrer">
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faGooglePlay} className={`${styles.playstore} ${styles.scale}`} />
                            <div className={styles.description}>Google Playstore</div>
                        </div>
                    </a>

                    <a href="https://testflight.apple.com/join/niH1xOyN" target="_blank" rel="noreferrer">
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faAppStore} className={`${styles.appstore} ${styles.scale}`} />
                            <div className={styles.description}>Apple AppStore</div>
                        </div>
                    </a>

                    <a href="https://chrome.google.com/webstore/detail/continuity/iialcggedkdlcbjfmgbmnjofjnlhpccc" target="_blank" rel="noreferrer">
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faChrome} className={`${styles.chrome} ${styles.scale}`} />
                            <div className={styles.description}>Chrome Extension</div>
                        </div>
                    </a>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.title}>Features</div>
                <div ref={h1Ref} className={styles.features_containers}>
                    <Tile {...features[0]} key={`tile_0`} />
                </div>
                <div ref={h2Ref} className={styles.features_containers}>
                    <Tile {...features[1]} key={`tile_1`} />
                </div>
                <div ref={h3Ref} className={styles.features_containers}>
                    <Tile {...features[2]} key={`tile_2`} />
                </div>
            </div>

            <div>
                <div className={styles.subheading}>
                    And much more coming soon...
                </div>
                <MoreFeatures />
            </div>
        </main>
    )
}