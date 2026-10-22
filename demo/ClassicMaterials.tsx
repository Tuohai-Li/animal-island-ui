import React, { useRef } from 'react';
import { BackTop, Divider, Footer, Icon, ICON_LIST, ITEM_LIST, ITEM_COUNT, Cursor } from '../src';
import styles from './classic-preview.module.less';

export default function ClassicMaterials() {
    const scrollRef = useRef<HTMLDivElement>(null);
    return (
        <div className={styles.column}>
            <section className={styles.panel}>
                <div className={styles.heading}>
                    <Icon name="icon-miles" size={24} />
                    <h2>Icon 内置图片图标</h2>
                    <span>
                        {ICON_LIST.length} + {ITEM_COUNT}
                    </span>
                </div>
                <p className={styles.caption}>应用图标和物品位图已全部接回，悬停可查看轻轻弹跳的效果。</p>
                <div className={styles.materialIcons}>
                    {ICON_LIST.map((entry) => (
                        <div key={entry.name}>
                            <Icon name={entry.name} size={38} bounce aria-label={entry.label} />
                            <span>{entry.label}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.itemStrip}>
                    {ITEM_LIST.slice(0, 16).map((id) => (
                        <Icon key={id} item={id} size={32} aria-label={`物品 ${id}`} />
                    ))}
                </div>
                <a href="#/icon" className={styles.materialLink}>
                    查看全部 {ITEM_COUNT} 个物品图标
                </a>
            </section>
            <section className={styles.panel}>
                <div className={styles.heading}>
                    <Icon name="icon-design" size={24} />
                    <h2>Divider 历史分割线</h2>
                </div>
                {(['line-brown', 'line-teal', 'line-white', 'line-yellow', 'wave-yellow', 'zigzag'] as const).map(
                    (type) => (
                        <div key={type} className={styles.dividerSample}>
                            <span>{type}</span>
                            <div
                                style={{
                                    background: type === 'line-white' || type === 'zigzag' ? '#b0c3a0' : '#f6f1e3',
                                    padding: '10px 6px',
                                    borderRadius: 8,
                                }}
                            >
                                <Divider type={type} />
                            </div>
                        </div>
                    )
                )}
                <p className={styles.caption}>也支持旧版字符串图标参数：</p>
                <Divider icon="icon-miles" />
            </section>
            <section className={styles.panel}>
                <div className={styles.heading}>
                    <Icon name="icon-helicopter" size={24} />
                    <h2>BackTop 位图按钮</h2>
                </div>
                <p className={styles.caption}>向下滚动这个区域，再点击右下角的旧版图案返回顶部。</p>
                <div style={{ position: 'relative' }}>
                    <div
                        ref={scrollRef}
                        data-testid="classic-scroll"
                        style={{ height: 170, overflow: 'auto', background: '#f3efdf', borderRadius: 16, padding: 20 }}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <p key={i} style={{ margin: '8px 0 24px' }}>
                                小岛散步日记 · 第 {i + 1} 页
                            </p>
                        ))}
                    </div>
                    <BackTop
                        target={() => scrollRef.current!}
                        visibilityHeight={70}
                        duration={200}
                        style={{ position: 'absolute', right: 12, bottom: 12 }}
                    />
                </div>
            </section>
            <section className={styles.panel}>
                <div className={styles.heading}>
                    <Icon name="icon-map" size={24} />
                    <h2>Footer & Cursor 历史素材</h2>
                </div>
                <p className={styles.caption}>树林、海岸装饰和经典手形光标一起回来。</p>
                <Cursor>
                    <div style={{ padding: 16, background: '#edf2e5', borderRadius: 12 }}>
                        把鼠标移到这里，试试旧版手形光标。
                    </div>
                </Cursor>
                <Footer type="tree" />
                <Footer type="sea" />
            </section>
        </div>
    );
}
