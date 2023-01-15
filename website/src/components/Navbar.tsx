import React from 'react';
import styles from '../styles/navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    scrollTarget?: React.RefObject<HTMLDivElement> | null,
    downloadLink?: string
}

export default function ({ scrollTarget, downloadLink }: Props) {
    return (
        <div className={styles.nav_container}>
            <Link href="/" className={styles.nav_name}>
                Continuity
            </Link>

            <div className={styles.right_menu}>

                <a href="https://www.buymeacoffee.com/prakshaljain" target="_blank">
                    <Image
                        className="coffeeImage"
                        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                        alt="Buy me a coffee"
                        height={30} // Desired size with correct aspect ratio
                        width={30} // Desired size with correct aspect ratio
                    />
                </a>

                {scrollTarget ? (
                    <div className={styles.download_btn} onClick={() => {
                        scrollTarget?.current?.scrollIntoView({ behavior: 'smooth' })
                    }}>
                        Download
                    </div>
                )
                    :
                    (
                        <Link href={downloadLink ? downloadLink : "/"} className={styles.download_btn}>
                            Download
                        </Link>
                    )}

            </div>
        </div>
    )
}