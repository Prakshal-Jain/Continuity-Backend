import styles from '../styles/more_features.module.css';

const featureList = [
    "Privacy Prevention (tracker remover)",
    "Ad Blocker (Built-in)",
    "Parental Controls",
    "Chrome Extensions on your phone",
    "VPN (Built-in)",
    "Contextual Google Search",
    "Developer Tools on your phone",
    "Focus Mode (Built-in)",
]

export default function MoreFeatures() {
    const colorDist = 1 / (featureList.length + 2);
    // const arr = Array(featureList.length).fill(0).map((_, i) => `rgba(242, 242, 247, ${colorDist * (i + 1)})`);

    return (
        <div className={styles.container}>
            {featureList.map((x, i) => (
                <div key={`more_features_${i}`} style={{ color: `rgba(242, 242, 247, ${1 - (colorDist * (i + 1))})` }}>
                    {x}
                </div>
            ))}
        </div>
    )
}