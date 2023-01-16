import styles from '../styles/footer.module.css';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <main className={styles.main}>
            <div className={styles.footer_links}>
                <a href="mailto:prakshaljain422@gmail.com" rel="noreferrer">Contact</a>
                <a href="https://www.buymeacoffee.com/prakshaljain" target="_blank" rel="noreferrer">Donate</a>
                <Link href="/privacy">Privacy</Link>
            </div>
            <div className={styles.design_develop}>
                Website Designed and Developed by <a href="https://prakshal-jain.github.io/Portfolio/" target="_blank" rel="noreferrer" className={styles.name}>Prakshal Jain</a>
            </div>
            <div className={styles.design_develop}>
                Continuity App Designed and Developed by <a href="https://www.linkedin.com/in/prakshal-jain-profile/" rel="noreferrer" target="_blank" className={styles.name}>Prakshal Jain</a> and <a href="https://www.linkedin.com/in/swastikn" target="_blank" rel="noreferrer" className={styles.name}>Swastik Naik</a>
            </div>
        </main>
    )
}