import styles from '@/styles/privacy.module.css'
import Head from 'next/head'
import Navbar from '@/components/Navbar'


export default function privacy() {
    return (
        <>
            <Head>
                <title>Continuity | Privacy</title>
                <meta name="description" content="Experience seamless and productive browsing with Continuity - tabs synced across all devices, secure personal info, a built-in content creator mind, and much more!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar downloadLink={"/#download"} />
            <main className={styles.main}>
                <div className={styles.heading}>Continuity Privacy Policy</div>
                <div className={styles.text_style}>Welcome to the <span style={{ fontWeight: "bold" }}>Continuity</span> app, a browser that seamlessly syncs tabs across all your devices in real-time. At Continuity, we value your privacy and are committed to protecting it. This privacy policy notice explains how we collect, use, and share your personal information when you use our app.</div>
                <div className={styles.text_style}>Please note that only the URLs of the tabs are shared across devices. We do not share any cookies, browser storage, or any other information. To ensure the security and privacy of your data, we encrypt the URLs before saving them on our databases. This means that the synchronization of tabs between devices is end-to-end encrypted.</div>

                <div className={styles.text_style}>To identify your account, we use your email id via Google authentication. In addition, we use your Google profile picture to set the default profile photo for your account. Please note that we do not collect or store any device information or personal information. All of this information is encrypted and stored securely on your device.</div>

                <div className={styles.text_style}>Thank you for choosing Continuity. If you have any questions or concerns about our privacy policy, please do not hesitate to contact us at <span style={{ fontWeight: "bold" }}>prakshaljain422@gmail.com</span>.</div>

                <div className={styles.updated_date}>Updated December 22, 2022</div>
            </main>
        </>
    )
}