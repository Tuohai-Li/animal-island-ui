# Decorative — 精确样式规范

承载海岛主题氛围的场景件：Time、Phone、Footer、Wallet 的精确取值

## Footer

默认 tree 恢复 80px 树林装饰，底部对齐、cover 填充；sea 恢复本地海岸 SVG，两者均为装饰 div。type="copyright" 保留语义化版权栏，显式传入 text/year 且未指定类型时也使用版权栏。

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

