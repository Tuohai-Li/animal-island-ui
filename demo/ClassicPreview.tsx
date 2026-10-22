import React, { useEffect, useRef, useState } from 'react';
import { CameraIcon, HeartIcon, LeafIcon, PlusIcon, SnowflakeIcon } from 'naive-icons';
import {
    Button,
    Input,
    Loading,
    Phone,
    Switch,
    Time,
    Wallet,
    WeddingInvitation,
    WeddingInvitationExportButton,
    type WeddingInvitationRef,
} from '../src';
import styles from './classic-preview.module.less';

const APP_NAMES: Record<string, string> = {
    camera: '相机',
    miles: '里程',
    critterpedia: '生物图鉴',
    diy: '手工制作',
    shopping: '购物',
    map: '地图',
    design: '设计',
    rescue: '救援服务',
    chat: '聊天',
};

export function PhoneDemo() {
    const [selected, setSelected] = useState('');
    return (
        <section className={styles.panel}>
            <div className={styles.heading}>
                <CameraIcon size={22} />
                <h2>Phone 小岛手机</h2>
                <span>经典回归</span>
            </div>
            <p className={styles.caption}>熟悉的九宫格，点一下，开启今天的小岛生活。</p>
            <div className={styles.phoneStage}>
                <Phone onAppClick={setSelected} />
            </div>
            <p className={styles.status} role="status">
                {selected ? `已打开：${APP_NAMES[selected]}` : '试试点击相机、地图或聊天图标'}
            </p>
        </section>
    );
}

export function WalletDemo() {
    const [balance, setBalance] = useState(24800);
    return (
        <section className={styles.panel}>
            <div className={styles.heading}>
                <LeafIcon size={22} />
                <h2>Wallet 钱袋</h2>
                <span>可以互动</span>
            </div>
            <p className={styles.caption}>一袋小小的积蓄，装下大大的小岛计划。</p>
            <div className={styles.walletStage}>
                <Wallet value={balance} size="large" aria-label="小岛余额" />
            </div>
            <div className={styles.actions}>
                <Button
                    type="primary"
                    icon={<PlusIcon size={16} />}
                    onClick={() => setBalance((value) => value + 1000)}
                >
                    收获 1,000
                </Button>
                <Button onClick={() => setBalance(24800)}>重置余额</Button>
            </div>
            <div className={styles.sizes}>
                <Wallet value={1280} size="small" />
                <Wallet value={12800} />
                <Wallet value="99,999" />
            </div>
        </section>
    );
}

export function WeddingDemo() {
    const invitationRef = useRef<WeddingInvitationRef>(null);
    const [bride, setBride] = useState('小兔');
    const [groom, setGroom] = useState('小狸');
    const [date, setDate] = useState('2026-12-20');
    const [lottery, setLottery] = useState(true);
    return (
        <section className={styles.panel}>
            <div className={styles.heading}>
                <HeartIcon size={22} />
                <h2>WeddingInvitation 婚礼请柬</h2>
            </div>
            <p className={styles.caption}>把重要的日子，写进一张有温度的邀请里。</p>
            <div className={styles.editor}>
                <label>
                    新娘姓名
                    <Input value={bride} onChange={(event) => setBride(event.target.value)} />
                </label>
                <label>
                    新郎姓名
                    <Input value={groom} onChange={(event) => setGroom(event.target.value)} />
                </label>
                <label className={styles.dateField}>
                    婚礼日期
                    <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                </label>
            </div>
            <div className={styles.toolbar}>
                <label className={styles.toggle}>
                    <Switch checked={lottery} onChange={setLottery} aria-label="显示抽奖券" />
                    附上抽奖券
                </label>
                <WeddingInvitationExportButton targetRef={invitationRef} filename="小岛婚礼请柬" />
            </div>
            <div className={styles.invitationStage}>
                <WeddingInvitation
                    ref={invitationRef}
                    brideName={bride}
                    groomName={groom}
                    date={date.replaceAll('-', '.')}
                    weekday="欢迎赴约"
                    showLotteryNumber={lottery}
                />
            </div>
        </section>
    );
}

function TimeAndLoadingDemo() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!loading) return;
        const timer = window.setTimeout(() => setLoading(false), 1800);
        return () => window.clearTimeout(timer);
    }, [loading]);
    return (
        <section className={styles.panel}>
            <div className={styles.heading}>
                <SnowflakeIcon size={22} />
                <h2>Time & Loading</h2>
                <span>沿用最新版</span>
            </div>
            <p className={styles.caption}>时钟照常滴答，雪花轻轻落下。</p>
            <div className={styles.clockStage}>
                <Time locale="zh-cn" />
            </div>
            <Button block onClick={() => setLoading(true)}>
                看看落雪加载效果
            </Button>
            <Loading active={loading} tip="正在准备小岛的惊喜…" fadeDuration={0.3} />
        </section>
    );
}

export default function ClassicPreview() {
    return (
        <div className={styles.preview}>
            <div className={styles.intro}>
                <span className={styles.eyebrow}>
                    <LeafIcon size={16} /> ANIMAL ISLAND · CLASSIC COLLECTION
                </span>
                <h1>久违了，小岛的老朋友。</h1>
                <p>在 v2.3.0 的小岛上，重新遇见手机、钱袋和婚礼请柬。</p>
                <div className={styles.chips}>
                    <span>3 个经典组件回归</span>
                    <span>实时编辑与互动</span>
                    <span>支持保存请柬</span>
                </div>
            </div>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <PhoneDemo />
                    <WalletDemo />
                    <TimeAndLoadingDemo />
                </div>
                <div className={styles.column}>
                    <WeddingDemo />
                </div>
            </div>
        </div>
    );
}
