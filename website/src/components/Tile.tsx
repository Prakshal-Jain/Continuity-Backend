import styles from '../styles/tile.module.css';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import React from 'react';
import { ReactElement } from 'react';


export type Props = {
    title: string | ReactElement,
    description?: string | ReactElement,
    video: ReactElement,
    extraWidth?: boolean,
    animated?: boolean
}

const Tile = ({ title, description, video, extraWidth = false, animated = true }: Props) => {
    if (animated) {
        return (
            <AnimationOnScroll animateIn="animate__fadeInUp" className={styles.tile_container} animateOnce={true}>
                <div className={extraWidth === true ? styles.extra_width : styles.normal_width}>
                    {video}
                </div>
                <div className={styles.text_container}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.description}>{description}</div>
                </div>
            </AnimationOnScroll>
        )
    }
    else {
        return (
            <div className={styles.tile_container}>
                <div className={extraWidth === true ? styles.extra_width : styles.normal_width}>
                    {video}
                </div>
                <div className={styles.text_container}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.description}>{description}</div>
                </div>
            </div>
        )
    }
}

export default Tile