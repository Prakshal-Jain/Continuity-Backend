import styles from '@/styles/contact.module.css'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tile, { Props } from '@/components/Tile';
import Image from 'next/image';
import prakshal from '../../public/images/Prakshal.jpg';
import team_photo from '../../public/images/team_photo.png';
import zeal from '../../public/images/zeal.png';
import presentation from '../../public/images/presentation.png';
import swastik from '../../public/images/Swastik.jpeg';
import unnati from '../../public/images/Unnati.jpeg';
import scott from '../../public/images/Scott.jpeg';
import hackathon from '../../public/images/hackathon.png';

export default function about() {
    return (
        <>
            <Head>
                <title>Continuity | Our Story</title>
                <meta name="description" content="Experience seamless and productive browsing with Continuity - tabs synced across all devices, secure personal info, a built-in content creator mind, and much more!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar downloadLink={"/#download"} />
            <main className={styles.main} style={{ gap: '3rem' }}>
                <div className={styles.heading}>Our Story</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <p style={{ fontSize: 'large' }}>
                        Whether you&apos;re a user of our product, an investor, an intern looking for opportunities, or just a curious bystander, at Continuity Browser, we believe that our story is as important as the product we&apos;ve created.
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <Image src={team_photo} alt="Team Photo" width={420} style={{ borderRadius: '10px' }} />
                    </div>
                    <p style={{ fontSize: 'large' }}>
                        We would love to share how and why we built Continuity Browser, and what drives us to make browsing more efficient and secure for everyone. By learning about our journey, you&apos;ll get a glimpse into our passion for innovation, our commitment to user privacy, and the values that drive us forward.
                    </p>
                    <p style={{ fontSize: 'large', fontWeight: 'bold' }}>
                        In a world where the browsing market is dominated by major competitors who treat user information as a mere commodity, four ambitious individuals came together with a common goal - to solve a problem that they all personally faced.
                    </p>
                </div>

                <div className={styles.img_paragraph}>
                    <div>
                        <Image src={zeal} alt="Zeal Pitch Photo" height={300} style={{ borderRadius: '10px' }} />
                    </div>
                    <p style={{ fontSize: 'large' }}>
                        Unnati and Prakshal were no strangers to the world of startups, having already founded their first venture called Zeal. However, they quickly realized that finding the right team wasn&apos;t enough to build a successful business. They needed a more sustainable solution, one that could address a problem they both faced firsthand.
                    </p>
                </div>

                <div className={styles.img_paragraph}>
                    <p style={{ fontSize: 'large' }}>
                        Prakshal had experienced the issue during his internship at Meta, where he missed crucial information during meetings due to missing links on his device. Unnati, on the other hand, was organizing an event with a friend and sent her the link to submit a proposal. Her friend scolded her for not having an Apple device and having to email herself the link from her phone to access it on her laptop. This inspired them to create a more inclusive solution.
                    </p>
                    <div>
                        <Image src={presentation} alt="Prakshal Presentation and Unnati Apple Device" width={450} style={{ borderRadius: '10px' }} />
                    </div>
                </div>

                <div className={styles.img_paragraph}>
                    <div>
                        <Image src={hackathon} alt="UB Hacking" height={300} style={{ borderRadius: '10px' }} />
                    </div>
                    <p style={{ fontSize: 'large' }}>
                        Meanwhile, Swastik and Prakshal met at UB Hacking and quickly bonded over their shared experiences. Swastik had been a victim of a banking scam and could empathize with the need for a safer browsing experience. Together, they built the first prototype of Continuity Browser - a solution that would make browsing more seamless and secure for all.
                    </p>
                </div>

                <div className={styles.img_paragraph}>
                    <p style={{ fontSize: 'large' }}>
                        As fate would have it, they were also introduced to Dr. Scott, a seasoned researcher who shared their passion for productivity. Dr. Scott had faced the challenge of visiting multiple websites to find simple facts, and was eager to join forces with the team.
                    </p>
                    <div>
                        <Image src={scott} alt="Dr. Scott Winters" height={160} style={{ borderRadius: '10px' }} />
                    </div>
                </div>

                <p style={{ fontSize: 'large' }}>
                    And thus, Continuity was born - a browser that not only addresses the challenges of device compatibility, but also ensures a more streamlined browsing experience for everyone. With their shared experiences and passion for innovation, this dynamic team is committed to revolutionalize the browsing experience and making the internet a better place for all.
                </p>

                {/* {team.map((props: Props, idx) => <Tile {...props} key={`about_${idx}`} animated={false} />)} */}
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