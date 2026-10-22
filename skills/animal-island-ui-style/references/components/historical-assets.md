# Historical assets

## Icon

Restores ten named application images and 488 numbered item PNGs. `ICON_LIST`, `ITEM_LIST` and `ITEM_COUNT` expose the actual catalogue; IDs have gaps, so iterate ITEM_LIST rather than constructing sequential IDs. Icons use local background images and default to aria-hidden. An aria-label or aria-labelledby exposes an image role. Sizes accept pixels or CSS strings; bounce animates on hover and stops under reduced motion.

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
