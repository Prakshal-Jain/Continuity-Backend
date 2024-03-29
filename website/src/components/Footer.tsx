import styles from '../styles/footer.module.css';
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faInstagram } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
    return (
        <main className={styles.main}>
            <div>
                <div className={styles.heading}>Join Us On</div>
                <div className={styles.social}>
                    <a href="https://discord.gg/TwJ863WJsQ" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faDiscord} className={styles.scale} style={{ color: 'rgba(88, 101, 242, 1)' }} />
                    </a>
                    <a href="https://www.instagram.com/continuitybrowser/" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faInstagram} className={styles.scale} style={{ color: '#C13584' }} />
                    </a>
                </div>
            </div>
            <div className={styles.footer_links}>
                <Link href="/help">Help</Link>
                <Link href="/contact">Contact</Link>
                <a href="https://www.buymeacoffee.com/prakshaljain" target="_blank" rel="noreferrer">Donate</a>
                <Link href="/privacy">Privacy</Link>
                <Link href="/our_story">Our Story</Link>
            </div>
            <div className={styles.design_develop}>
                Website Designed and Developed by <a href="https://prakshal-jain.github.io/Portfolio/" target="_blank" rel="noreferrer" className={styles.name}>Prakshal Jain</a>
            </div>
            {/* <div className={styles.design_develop}>
                Continuity App Designed and Developed by <a href="https://www.linkedin.com/in/prakshal-jain-profile/" rel="noreferrer" target="_blank" className={styles.name}>Prakshal Jain</a> and <a href="https://www.linkedin.com/in/swastikn" target="_blank" rel="noreferrer" className={styles.name}>Swastik Naik</a>
            </div> */}
        </main>
    )
}