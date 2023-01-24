import styles from '@/styles/contact.module.css'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tile, { Props } from '@/components/Tile';
import Image from 'next/image';
import prakshal from '../../public/images/Prakshal.jpg';
import swastik from '../../public/images/Swastik.jpeg';
import unnati from '../../public/images/Unnati.jpeg';
import scott from '../../public/images/Scott.jpeg';

export default function about() {
    return (
        <>
            <Head>
                <title>Continuity | About Us</title>
                <meta name="description" content="Experience seamless and productive browsing with Continuity - tabs synced across all devices, secure personal info, a built-in content creator mind, and much more!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar downloadLink={"/#download"} />
            <main className={styles.main} style={{ gap: '3rem' }}>
                <div className={styles.heading}>About Our Team</div>
                {team.map((props: Props, idx) => <Tile {...props} key={`about_${idx}`} animated={false} />)}
            </main>
        </>
    )
}



const team = [
    {
        title: <a href="https://www.linkedin.com/in/prakshal-jain-profile/" target="_blank" rel="noreferrer">Prakshal Jain</a>,
        description: (
            <>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Ex-Meta</div>

                <div>
                    My goal is to remain on the cutting-edge of advancements and make an impact on the world by simplifying tasks for users in creative and innovative ways.
                </div>

                <div>
                    I love working as a Software Engineer because it gives an artistic point of view and abstracts the complexity hidden underneath as well as provides the fun of working on sophisticated logic to handle data efficiently. I have been working on designing, prototyping, and implementing user interfaces for over 5 years with multiple industry-level work experiences. The UI/UX is so important because it is one of the first things that help customers emotionally connected to a product/company.
                </div>

                <div>
                    I work at Meta as a Fullstack Developer. I am proficient in languages like JavaScript, Python, PHP, and frameworks like React JS, React Native, etc.
                </div>
            </>
        ),
        video: <Image src={prakshal} alt="Prakshal Jain" height={150} width={150} style={{ borderRadius: '10px' }} />,
        extraWidth: false
    },

    {
        title: <a href="https://www.linkedin.com/in/swastikn/" target="_blank" rel="noreferrer">Swastik Naik</a>,
        description: (
            <>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Ex-Shopify</div>
                <div>
                    I work at Shopify as a Backend developer. I work with technologies like ruby, rails, typescript and react as well as on the production pipeline to make deploy times lean and mean.
                </div>
            </>
        ),
        video: <Image src={swastik} alt="Swastik Naik" height={150} width={150} style={{ borderRadius: '10px' }} />,
        extraWidth: false
    },

    {
        title: <a href="https://www.linkedin.com/in/scott-winters-phd-9270951b3/" target="_blank" rel="noreferrer">Scott (Mulder) Winters PhD</a>,
        description: (
            <>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Researcher, Strategist and Team Builder, Catalyst Ops Inc</div>
                <div>
                    Dr. Scott Theodore Winters has a passion for small business, with an expertise in marketing strategy and tactics. Scott holds a Doctorate in Leadership and Policy Studies and a Master of Arts in Organizational Leadership, atop a Bachelors in Business Management and Economics. Scott is currently enrolled at the University at Buffalo School of Management, completing their MBA while working on several startup projects, including ContinuityBrowser.
                </div>
            </>
        ),
        video: <Image src={scott} alt="Scott (Mulder) Winters PhD" height={150} width={150} style={{ borderRadius: '10px' }} />,
        extraWidth: false
    },

    {
        title: <a href="https://www.linkedin.com/in/unnati15/" target="_blank" rel="noreferrer">Unnati Agarwal</a>,
        description: (
            <>
                <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Google Developers Student Club Lead</div>
                <div>
                    My experience interning at hospitals and clinics has taught me that life is unpredictable and so I should make the most of it. I love to help people; I want to be the invisible fairy godmother who changes people’s lives - the person behind the doctors, who makes discoveries and inventions, improves products that doctors and surgeons use to save more people.
                </div>
            </>
        ),
        video: <Image src={unnati} alt="Unnati Agarwal" height={150} width={150} style={{ borderRadius: '10px' }} />,
        extraWidth: false
    },

]