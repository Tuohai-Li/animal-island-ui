import React from 'react';
import classNames from 'classnames';
import styles from './footer.module.less';

export type FooterType = 'sea' | 'tree' | 'copyright';

export interface FooterProps {
    /** 经典海岸、树林，或版权栏 */
    type?: FooterType;
    /** 版权文案，默认 `All Rights Reserved.` */
    text?: string;
    /** 年份，默认取当前年份（动态获取） */
    year?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({ type, text, year, className, style }) => {
    const resolvedType = type ?? (text !== undefined || year !== undefined ? 'copyright' : 'tree');
    if (resolvedType !== 'copyright') {
        return (
            <div
                className={classNames(styles.artwork, styles[resolvedType], className)}
                style={style}
                aria-hidden="true"
            />
        );
    }
    const displayYear = year ?? new Date().getFullYear();
    return (
        <footer className={classNames(styles.footer, className)} style={style}>
            © {displayYear} {text ?? 'All Rights Reserved.'}
        </footer>
    );
};

Footer.displayName = 'Footer';
