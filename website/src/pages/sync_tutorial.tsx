import styles from '@/styles/sync_tutorial.module.css'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons'
import { faAngleLeft, faAngleRight, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import playstore_qr from "../../public/images/playstore_qr.png";
import appstore_qr from "../../public/images/appstore_qr.png";

export default function sync_tutorial() {
    const router = useRouter();
    const [currStep, setCurrStep] = useState(0);
    const [email, setEmail] = useState<string | string[] | null>(null);
    const [deviceName, setDeviceName] = useState<string | string[] | null>(null);

    useEffect(() => {
        if (router?.query?.email !== null && router?.query?.email !== undefined && router?.query?.email?.length > 0) {
            setEmail(router?.query?.email)
        };
        if (router?.query?.device_name !== null && router?.query?.device_name !== undefined) {
            setDeviceName(router?.query?.device_name)
        };

        // Set the step from URL
        
        // if (router?.query?.step !== null && router?.query?.step !== undefined) {
        //     const stepCount = Number(router?.query?.step);
        //     console.log(stepCount);
        //     const step = isNaN(stepCount) ? null : stepCount;
        //     setCurrStep(step ?? 0)
        // };
    })

    const steps = [
        {
            element: (
                <>
                    <div className={styles.heading}>Continuity Device Setup Tutorial</div>
                    <div className={styles.subheading}>
                        To sync all your tabs across multiple devices in real time using Continuity, please select the type of device you would like to set up next.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.link_container} onClick={() => setCurrStep(1)}>
                            <FontAwesomeIcon icon={faAndroid} color='#669933' style={{ fontSize: 'x-large' }} />
                            <div>
                                Android (Phone or Tablet)
                            </div>
                        </div>

                        <div className={styles.link_container} onClick={() => setCurrStep(5)}>
                            <FontAwesomeIcon icon={faApple} color='#000' style={{ fontSize: 'x-large' }} />
                            <div>
                                iOS (Apple iPhone or iPad)
                            </div>
                        </div>

                        <div className={styles.link_container} onClick={() => setCurrStep(8)}>
                            <FontAwesomeIcon icon={faPuzzlePiece} color='rgba(10, 132, 255, 1)' style={{ fontSize: 'x-large' }} />
                            <div>
                                Chrome Extension (Laptop or Desktop)
                            </div>
                        </div>
                    </div>
                </>
            ),

            previous: null,
            next: null
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Setup your Android Device</div>
                    <div className={styles.text_style} style={{ textAlign: "center" }}>Step 1</div>
                    <div className={styles.larger_text}>Download the Continuity App on your Android device.</div>

                    <div>
                        <Image
                            style={{ borderRadius: '10px', marginTop: 20, marginBottom: 20 }}
                            src={playstore_qr}
                            alt="Playstore QR code"
                            height={200} // Desired size with correct aspect ratio
                            width={200} // Desired size with correct aspect ratio
                        />
                    </div>

                    <div>
                        <div className={styles.larger_text}>Or, visit this link: <a className={styles.link} href='https://play.google.com/store/apps/details?id=com.continuity&pli=1' target="_blank" rel="noreferrer">https://play.google.com/store/apps/details?id=com.continuity&pli=1</a>.</div>
                    </div>
                </>
            ),

            previous: 0,
            next: 2
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Setup your Android Device</div>
                    <div className={styles.text_style} style={{ textAlign: "center" }}>Step 2</div>
                    {(email === null || email === undefined) ?
                        (
                            <div className={styles.larger_text}>Use the <span style={{ fontWeight: "bold" }}>same</span> Email ID across all your devices for the tabs to sync.</div>
                        )
                        :
                        <>
                            <div className={styles.larger_text}>Use the Email ID:</div>
                            <div className={`${styles.larger_text} ${styles.border_container}`}>{email}</div>
                            <div className={styles.larger_text}>to log into continuity on your Android device.</div>
                        </>
                    }
                </>
            ),

            previous: 1,
            next: 3
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Setup your Android Device</div>
                    <div className={styles.text_style} style={{ textAlign: "center" }}>Step 3</div>
                    <div className={styles.larger_text}>Enter a device name which is <span style={{ fontWeight: "bold" }}>different</span> from all your currently registered devices.</div>
                    {(deviceName !== null && deviceName !== undefined) && (
                        <>
                            <div className={styles.larger_text} style={{ marginTop: '0.5rem' }}>For example:</div>
                            <div className={`${styles.larger_text} ${styles.border_container}`}>{'Android ' + deviceName}</div>
                        </>
                    )}
                </>
            ),

            previous: 2,
            next: 4
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Congratulations!</div>
                    <div className={styles.larger_text}>All your devices are now in sync.</div>
                    <div className={styles.larger_text}>If you have any questions, please send us an email at <a className={styles.link} href='mailto:continuitybrowser@gmail.com'>continuitybrowser@gmail.com</a>.</div>
                </>
            ),

            previous: 3,
            next: null,
            isFinalStep: true
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Setup your iOS Device</div>
                    <div className={styles.text_style} style={{ textAlign: "center" }}>Step 1</div>
                    <div className={styles.larger_text}>Download the Continuity App on your iOS device.</div>

                    <div>
                        <Image
                            style={{ borderRadius: '10px', marginTop: 20, marginBottom: 20 }}
                            src={appstore_qr}
                            alt="Appstore QR code"
                            height={200} // Desired size with correct aspect ratio
                            width={200} // Desired size with correct aspect ratio
                        />
                    </div>

                    <div>
                        <div className={styles.larger_text}>Or, visit this link: <a className={styles.link} href='https://apps.apple.com/us/app/continuity-browser/id1666743201' target="_blank" rel="noreferrer">https://apps.apple.com/us/app/continuity-browser/id1666743201</a>.</div>
                    </div>
                </>
            ),

            previous: 0,
            next: 6
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Setup your iOS Device</div>
                    <div className={styles.text_style} style={{ textAlign: "center" }}>Step 2</div>
                    {(email === null || email === undefined) ?
                        (
                            <div className={styles.larger_text}>Use the <span style={{ fontWeight: "bold" }}>same</span> Email ID across all your devices for the tabs to sync.</div>
                        )
                        :
                        <>
                            <div className={styles.larger_text}>Use the Email ID:</div>
                            <div className={`${styles.larger_text} ${styles.border_container}`}>{email}</div>
                            <div className={styles.larger_text}>to log into continuity on your Android device.</div>
                        </>
                    }
                </>
            ),

            previous: 5,
            next: 7
        },

        {
            element: (
                <>
                    <div className={styles.heading}>Setup your iOS Device</div>
                    <div className={styles.text_style} style={{ textAlign: "center" }}>Step 3</div>
                    {(deviceName !== null && deviceName !== undefined) && (
                        <>
                            <div className={styles.larger_text} style={{ marginTop: '0.5rem' }}>For example:</div>
                            <div className={`${styles.larger_text} ${styles.border_container}`}>{'iOS ' + deviceName}</div>
                        </>
                    )}
                </>
            ),

            previous: 6,
            next: 4
        },
    ]


    return (
        <>
            <Head>
                <title>Continuity | Devices Setup</title>
                <meta name="description" content="Experience seamless and productive browsing with Continuity - tabs synced across all devices, secure personal info, a built-in content creator mind, and much more!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar downloadLink={"/#download"} />
            <main className={styles.main}>
                {steps[currStep]?.element}
                <div className={styles.navigation_container}>
                    {steps[currStep]?.previous !== null && (
                        <div className={styles.prevBtn} onClick={() => setCurrStep(steps[currStep]?.previous ?? 0)}>
                            <FontAwesomeIcon icon={faAngleLeft} color='#000' style={{ fontSize: 'large' }} />
                            <div>
                                Previous Step
                            </div>
                        </div>
                    )}
                    {(steps[currStep]?.next !== null || steps[currStep]?.isFinalStep === true) && (
                        <div className={styles.nextBtn} onClick={() => setCurrStep(steps[currStep]?.next ?? 0)}>
                            <div>
                                {(steps[currStep]?.isFinalStep === true) ? "Add more devices" : "Next"}
                            </div>

                            {(steps[currStep]?.isFinalStep !== true) && (
                                <FontAwesomeIcon icon={faAngleRight} color='#fff' style={{ fontSize: 'large' }} />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}