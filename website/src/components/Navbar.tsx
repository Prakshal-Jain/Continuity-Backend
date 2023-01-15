import React from 'react';
import styles from '../styles/navbar.module.css';

type Props = {
    scrollTarget: React.RefObject<HTMLDivElement>
}

export default function ({ scrollTarget }: Props) {
    return (
        <div className={styles.nav_container}>
            <div className={styles.nav_name}>
                Continuity
            </div>

            <div className={styles.download_btn} onClick={() => {
                scrollTarget?.current?.scrollIntoView({ behavior: 'smooth' })
            }}>
                Download
            </div>
        </div>
    )
}