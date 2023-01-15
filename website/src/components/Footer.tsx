import styles from '../styles/footer.module.css';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <main className={styles.main}>
            <div className={styles.footer_links}>
                <a href="mailto:prakshaljain422@gmail.com">Contact</a>
                <a href="https://www.buymeacoffee.com/prakshaljain" target="_blank">Donate</a>
                <Link href="/privacy">Privacy</Link>
            </div>
            <div className={styles.design_develop}>
                Designed and developed by <a href="https://prakshal-jain.github.io/Portfolio/" target="_blank" className={styles.name}>Prakshal Jain</a>
            </div>
        </main>
    )
}