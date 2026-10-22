# Classic components

The restored components are opt-in exports. Import the library stylesheet as usual.

## Phone

```tsx
export interface PhoneProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 手机欢迎语 */
    greeting?: string;
    /** 点击应用时返回应用标识 */
    onAppClick?: (appId: string) => void;
}
```

## Wallet

```tsx
export type WalletSize = 'small' | 'medium' | 'large';

export interface WalletProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** 金额数值，数字会按千分位格式化；字符串则原样展示 */
    value?: number | string;
    /** 自定义货币图标，默认使用动森风格钱袋 */
    icon?: React.ReactNode;
    /** 尺寸预设 */
    size?: WalletSize;
    /** 千分位分隔符，默认 ","，传 "" 可关闭 */
    thousandSeparator?: string;
    className?: string;
    style?: React.CSSProperties;
}
```

## WeddingInvitation

```tsx
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
```
