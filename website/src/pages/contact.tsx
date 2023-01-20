import styles from '@/styles/contact.module.css'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function privacy() {
    return (
        <>
            <Head>
                <title>Continuity | Contact</title>
                <meta name="description" content="Experience seamless and productive browsing with Continuity - tabs synced across all devices, secure personal info, a built-in content creator mind, and much more!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar downloadLink={"/#download"} />
            <main className={styles.main}>
                <div className={styles.heading}>Contacting Continuity</div>
                <div className={styles.contact_options}>
                    <a href="https://discord.gg/TwJ863WJsQ" rel="noreferrer">
                        <div className={styles.option}>
                            <FontAwesomeIcon icon={faDiscord} style={{ color: 'rgba(88, 101, 242, 1)', fontSize: 'x-large' }} />
                            <span style={{fontSize: 'x-large', fontWeight: 'bold'}}>Discord</span> (recommended for quick responses)
                        </div>
                    </a>

                    <a href="mailto:prakshaljain422@gmail.com" rel="noreferrer">
                        <div className={styles.option}>
                            <FontAwesomeIcon icon={faEnvelope} style={{ color: 'rgba(255, 45, 85, 1)', fontSize: 'x-large' }} />
                            <span style={{fontSize: 'x-large', fontWeight: 'bold'}}>Email us</span>
                        </div>
                    </a>

                </div>
            </main>
        </>
    )
}