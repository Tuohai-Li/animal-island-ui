import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import iconMap from '../../assets/img/icons/icon-map.svg';
import styles from './wedding-invitation.module.less';
import { LeafIcon, FlowerIcon, HeartIcon, StarIcon, DownloadIcon } from 'naive-icons';
import { exportInvitation } from './exportImage';
import brideAndGroomImg from './img/brideandgroom.png';
import weddingTitleImg from './img/wedding.png';

export interface WeddingInvitationProps {
    groomName?: string;
    brideName?: string;
    date?: string;
    weekday?: string;
    time?: string;
    venue?: string;
    address?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    message?: React.ReactNode;
    showLotteryNumber?: boolean;
    lotteryNumber?: string;
    lotteryLabel?: React.ReactNode;
    lotteryHint?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface WeddingInvitationRef {
    exportAsImage: (filename?: string) => Promise<void>;
    getElement: () => HTMLDivElement | null;
}

const cn = (...names: (string | false | undefined)[]) =>
    names
        .filter(Boolean)
        .flatMap((name) => String(name).split(' '))
        .map((name) => styles[name] ?? name)
        .join(' ');
const Leaf = ({ className }: { className?: string }) => (
    <LeafIcon className={className} size={56} color="#8ac68a" aria-hidden="true" />
);
const Flower = ({ color, size = 28 }: { color?: string; center?: string; size?: number }) => (
    <FlowerIcon size={size} color={color} aria-hidden="true" />
);
const Heart = ({ size = 64 }: { size?: number }) => <HeartIcon size={size} color="#fc736d" aria-hidden="true" />;
const Star = ({ size = 18, color = '#f7cd67' }: { size?: number; color?: string }) => (
    <StarIcon size={size} color={color} aria-hidden="true" />
);
const ScissorsIcon = () => <span aria-hidden="true" />;

export const WeddingInvitation = forwardRef<WeddingInvitationRef, WeddingInvitationProps>(
    (
        {
            groomName = '小狸',
            brideName = '小兔',
            date = '2026.06.15',
            weekday = '星期六',
            time = '10:00 AM',
            venue = '彩虹岛 · 樱花广场',
            address = '小岛中央广场 · 花园入口',
            title = 'Wedding Invitation',
            subtitle = <img src={weddingTitleImg} alt="集合啦 婚礼森友会" />,
            message = '哎呀，恭喜恭喜！我们要在小岛上举办婚礼啦~ 诚挚邀请您一同前来见证这个被花瓣和音符包围的日子！',
            showLotteryNumber = true,
            lotteryNumber = '0001',
            lotteryLabel = 'LUCKY NUMBER',
            lotteryHint = '凭此号码参与现场抽奖 · Keep this stub for the lucky draw',
            className,
            style,
        },
        ref
    ) => {
        const rootRef = useRef<HTMLDivElement>(null);

        const exportAsImage = React.useCallback(async (filename = 'wedding-invitation') => {
            if (!rootRef.current) {
                return;
            }
            await exportInvitation(rootRef.current, filename);
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                exportAsImage,
                getElement: () => rootRef.current,
            }),
            [exportAsImage]
        );

        return (
            <div
                ref={rootRef}
                role="article"
                aria-label={`${brideName}与${groomName}的婚礼请柬`}
                className={cn(
                    'animal-wedding-invitation',
                    !showLotteryNumber && 'animal-wedding-no-lottery',
                    className
                )}
                style={style}
            >
                <Leaf className={cn('animal-wedding-corner-leaf animal-wedding-corner-tl')} />
                <Leaf className={cn('animal-wedding-corner-leaf animal-wedding-corner-tr')} />
                <Leaf className={cn('animal-wedding-corner-leaf animal-wedding-corner-bl')} />
                <Leaf className={cn('animal-wedding-corner-leaf animal-wedding-corner-br')} />

                <span className={cn('animal-wedding-float-item animal-wedding-float-f1')}>
                    <Flower color="#f8a6b2" />
                </span>
                <span className={cn('animal-wedding-float-item animal-wedding-float-f2')}>
                    <Flower color="#ecdf52" center="#e59266" size={22} />
                </span>
                <span className={cn('animal-wedding-float-item animal-wedding-float-f3')}>
                    <Flower color="#b77dee" size={20} />
                </span>
                <span className={cn('animal-wedding-float-item animal-wedding-float-s1')}>
                    <Star color="#f7cd67" />
                </span>
                <span className={cn('animal-wedding-float-item animal-wedding-float-s2')}>
                    <Star color="#82d5bb" size={14} />
                </span>

                <div className={cn('animal-wedding-banner')}>
                    <span className={cn('animal-wedding-banner-line')} />
                    <Star size={16} color="#f7cd67" />
                    <span className={cn('animal-wedding-banner-line')} />
                </div>

                <div className={cn('animal-wedding-title-en')}>{title}</div>
                <div className={cn('animal-wedding-title-zh')}>{subtitle}</div>

                <div className={cn('animal-wedding-couple-image')}>
                    <img src={brideAndGroomImg} alt="bride and groom" />
                </div>

                <div className={cn('animal-wedding-couple-row')}>
                    <div className={cn('animal-wedding-mascot')}>
                        <div className={cn('animal-wedding-name')}>{brideName}</div>
                    </div>
                    <div className={cn('animal-wedding-heart-col')}>
                        <Heart size={30} />
                    </div>
                    <div className={cn('animal-wedding-mascot')}>
                        <div className={cn('animal-wedding-name')}>{groomName}</div>
                    </div>
                </div>

                <div className={cn('animal-wedding-date-card')}>
                    <div className={cn('animal-wedding-date-label')}>婚礼时间</div>
                    <div className={cn('animal-wedding-date-value')}>{date}</div>
                    <div className={cn('animal-wedding-date-meta')}>
                        <span>{weekday}</span>
                        <span className={cn('animal-wedding-dot')}>·</span>
                        <span>{time}</span>
                    </div>
                </div>

                <div className={cn('animal-wedding-venue-card')}>
                    <span className={cn('animal-wedding-venue-icon')}>
                        <img src={iconMap} alt="venue" width={26} height={26} />
                    </span>
                    <div className={cn('animal-wedding-venue-text')}>
                        <div className={cn('animal-wedding-venue-name')}>{venue}</div>
                        <div className={cn('animal-wedding-venue-addr')}>{address}</div>
                    </div>
                </div>

                <div className={cn('animal-wedding-message')}>{message}</div>

                {showLotteryNumber && (
                    <div className={cn('animal-wedding-signature-lottery')}>
                        <span>抽奖码</span>
                        <span className={cn('animal-wedding-signature-lottery-no')}>
                            <span className={cn('animal-wedding-lottery-hash')}>NO.</span>
                            {lotteryNumber}
                        </span>
                    </div>
                )}

                {showLotteryNumber && (
                    <div className={cn('animal-wedding-lottery')}>
                        <span className={cn('animal-wedding-tear-hint')}>
                            <ScissorsIcon />
                            <span>沿虚线剪开</span>
                            <ScissorsIcon />
                        </span>
                        <div className={cn('animal-wedding-lottery-title')}>婚礼抽奖券</div>
                        <div className={cn('animal-wedding-lottery-label')}>
                            <Star size={12} color="#f7cd67" />
                            <span>{lotteryLabel}</span>
                            <Star size={12} color="#f7cd67" />
                        </div>
                        <div className={cn('animal-wedding-lottery-number')}>
                            <span className={cn('animal-wedding-lottery-hash')}>NO.</span>
                            {lotteryNumber}
                        </div>
                        {lotteryHint && <div className={cn('animal-wedding-lottery-hint')}>{lotteryHint}</div>}
                    </div>
                )}
            </div>
        );
    }
);

WeddingInvitation.displayName = 'WeddingInvitation';

export interface WeddingInvitationExportButtonProps {
    /** 请柬组件的 ref */
    targetRef: React.RefObject<WeddingInvitationRef | null>;
    /** 导出失败回调 */
    onError?: (error: Error) => void;
    filename?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const WeddingInvitationExportButton: React.FC<WeddingInvitationExportButtonProps> = ({
    targetRef,
    onError,
    filename = 'wedding-invitation',
    children = '保存为图片',
    className,
    style,
}) => {
    const [exporting, setExporting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleClick = async () => {
        if (exporting) {
            return;
        }

        setExporting(true);
        setErrorMessage('');
        try {
            if (!targetRef.current) throw new Error('请柬尚未就绪');
            await targetRef.current.exportAsImage(filename);
        } catch (error) {
            const failure = error instanceof Error ? error : new Error(String(error));
            setErrorMessage('图片导出失败，请重试');
            onError?.(failure);
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className={cn('animal-wedding-export-btn', className)}
                style={style}
                onClick={handleClick}
                disabled={exporting}
            >
                <DownloadIcon />
                {exporting ? '生成中…' : children}
            </button>
            {errorMessage && <span role="alert">{errorMessage}</span>}
        </>
    );
};

WeddingInvitationExportButton.displayName = 'WeddingInvitationExportButton';
