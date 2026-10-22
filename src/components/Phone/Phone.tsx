import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from './phone.module.less';

export interface PhoneProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 手机欢迎语 */
    greeting?: string;
    /** 点击应用时返回应用标识 */
    onAppClick?: (appId: string) => void;
}

interface App {
    id: string;
    label: string;
    iconClass: string;
    color: string;
    offset?: boolean;
    hasNewMessage?: boolean;
}

const apps: App[] = [
    { id: 'camera', label: '相机', iconClass: 'iconCamera', color: '#B77DEE', hasNewMessage: true },
    { id: 'miles', label: '里程', iconClass: 'iconMiles', color: '#889DF0', offset: true },
    { id: 'critterpedia', label: '生物图鉴', iconClass: 'iconCritterpedia', color: '#F7CD67' },
    { id: 'diy', label: '手工制作', iconClass: 'iconDiy', color: '#E59266' },
    { id: 'shopping', label: '购物', iconClass: 'iconDesign', color: '#F8A6B2' },
    { id: 'map', label: '地图', iconClass: 'iconMap', color: '#82D5BB', hasNewMessage: true },
    { id: 'design', label: '设计', iconClass: 'iconVariant', color: '#8AC68A' },
    { id: 'rescue', label: '救援服务', iconClass: 'iconHelicopter', color: '#FC736D' },
    { id: 'chat', label: '聊天', iconClass: 'iconChat', color: '#D1DA49' },
];

export const Phone: React.FC<PhoneProps> = ({ className, greeting = 'Welcome!', onAppClick, ...rest }) => {
    const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const clock = dayjs(time);

    return (
        <div className={`${styles.phoneContainer} ${className || ''}`} {...rest}>
            <div className={styles.phone}>
                <div className={styles.screenContent}>
                    <div className={styles.homeScreen}>
                        <div className={styles.dateDisplay}>
                            <div className={styles.dateDisplayHeader}>
                                <span className={styles.iconWifi} />
                                <div aria-label={clock.format('h:mm A')}>
                                    {clock.format('h')}
                                    <span className={styles.blink}>:</span>
                                    {clock.format('mmA')}
                                </div>
                                <span className={styles.iconLocation} />
                            </div>
                            <div className={styles.dayText}>{greeting}</div>
                        </div>
                        <div className={styles.appsGrid}>
                            {apps.map((app) => (
                                <button
                                    type="button"
                                    key={app.id}
                                    aria-label={app.label}
                                    onClick={() => onAppClick?.(app.id)}
                                    className={`${styles.appItem} ${app.offset ? styles.appItemOffset : ''}`}
                                    style={{ backgroundColor: app.color }}
                                >
                                    {app.hasNewMessage && <span className={styles.badge} />}
                                    <span
                                        className={`${styles.appIcon} ${styles[app.iconClass]} ${app.offset ? styles.appIconOffset : ''}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className={styles.pageIndicator}>
                            <span className={styles.iconPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Phone.displayName = 'Phone';
