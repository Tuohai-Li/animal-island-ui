# Decorative — pixel spec

Exact values for the scene-setting pieces that carry the island theme: Time, Phone, Footer and Wallet.

## Footer

Default `tree` restores the historical 80px tree artwork with bottom-aligned cover sizing. `sea` restores the local coastline SVG. Both are decorative divs. `type="copyright"` retains the semantic copyright footer; explicitly supplying text/year also selects that mode unless a type is specified.

```tsx
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
```

