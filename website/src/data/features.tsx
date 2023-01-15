import { Props } from '../components/Tile';

const video_style = { width: '60%', borderRadius: '25px', border: '0.5rem solid black' };

export const feaures = [
    {
        title: "Kick off here, wrap up there",
        description: "Imagine the convenience of having all your tabs seamlessly synced across multiple devices in real-time with Continuity. No more need to manually transfer tabs or waste time searching for the one you were just on. Continuity allows for effortless access to your open tabs on any device, whether you're on your desktop or on-the-go with your mobile phone.",
        video: (
            <video autoPlay={true} muted={true} loop={true} style={{ width: '100%', borderRadius: '15px' }}>
                <source src="videos/sync.mp4" type="video/mp4" />
            </video>
        ),
        extraWidth: true
    },
    {
        title: "Built with your privacy in mind",
        description: "Continuity offers comprehensive and intelligent Privacy Reports and Tracking Protection features to protect you from the websites and services that may collect your personal information. Unlike other browsers that rely on add-on extensions to provide similar functionality, Continuity's tracking protection is deeply integrated into the browser and ensures that data is securely shared between devices without the risk of third-party access. This sets Continuity apart from other browsers and makes it a game-changing choice for users who value privacy and security.",
        video: (
            <video autoPlay={true} muted={true} loop={true} style={video_style}>
                <source src="videos/privacy.mp4" type="video/mp4" />
            </video>
        )
    },
    {
        title: "Ultra Search",
        description: "With Ultra Search, you can find exactly what you're looking for in no time. The AI-generated suggestions are custom tailored to your specific needs, making it easier than ever to find the information you need. And for the first time ever, Ultra Search is seamlessly integrated into your web browser, making it a powerful tool for all of your online searches.",
        video: (
            <video autoPlay={true} muted={true} loop={true} style={{ width: '60%', borderRadius: '20px', border: '0.5rem solid black' }}>
                <source src="videos/ultrasearch.mp4" type="video/mp4" />
            </video>
        )
    },
]