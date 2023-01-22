import styles from '../styles/collapsible.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faClose, faCross } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type Props = {
    data: {
        title: JSX.Element | string,
        content: JSX.Element | string,
    }[]
}

export default function Collapsible({ data }: Props) {

    const [currOpen, setCurrOpen] = useState(0);

    return (
        <div className={styles.parent_container}>
            {data.map(({ title, content }, idx) => (
                <div key={`help_item_${idx}`} className={styles.collapsible_box}>
                    <div className={styles.header_box} onClick={() => setCurrOpen(currOpen === idx ? -1 : idx)}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div className={styles.close_icon} style={{ transform: `rotate(${currOpen === idx ? '0' : '45'}deg)` }}>
                            <FontAwesomeIcon icon={faClose} style={{ color: 'rgb(58, 58, 60)', fontSize: 'large' }} />
                        </div>
                    </div>
                    <div className={styles.content_box} style={{ display: currOpen === idx ? undefined : 'none' }}>
                        {content}
                    </div>
                </div>
            ))}
        </div>
    )
}