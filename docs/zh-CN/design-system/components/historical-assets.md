# 历史素材

## Icon

恢复 10 个应用图片图标和 488 个编号物品 PNG。ICON_LIST、ITEM_LIST、ITEM_COUNT 提供真实目录，编号存在间断，应遍历 ITEM_LIST。图标使用本地背景图片，默认 aria-hidden；设置可访问名称时暴露图片角色。尺寸支持像素或 CSS 字符串，悬停弹跳遵循减少动态效果偏好。

```tsx
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Built-in named icon. Mutually exclusive with `item`. */
    name?: IconName;
    /** Item glyph id from the "Items" sheet (see ITEM_LIST). Mutually exclusive with `name`. */
    item?: number;
    size?: number | string;
    bounce?: boolean;
}
```

```tsx
<Icon name="icon-camera" size={32} />
<Icon item={1} size={40} aria-label="物品" />
```
