# Decorative components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

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

## Background

```ts
type BackgroundType = 'default' | 'grid' | 'dots-dark-green' | 'sprinkles' | 'sweet-corner' | 'coffee-break'
    | 'dots-pink' | 'dots-purple' | 'dots-blue' | 'dots-yellow' | 'dots-orange' | 'dots-teal'
    | 'dots-green' | 'dots-red' | 'dots-lime-green' | 'dots-yellow-green' | 'dots-brown' | 'dots-warm-peach-pink'
    | 'dots-gray';

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: BackgroundType; // default 'default'
    children?: React.ReactNode;
}
```

```tsx
<Background style={{ height: 200 }} />
<Background type="dots-dark-green" style={{ height: 200 }} />
<Background type="sprinkles" style={{ minHeight: 200, padding: 24 }}>
    <p>Content renders above the pattern</p>
</Background>
```

Most types are pattern-only wallpapers with no image assets: `default` is cream `rgb(247,243,223)` with beige polka dots; `grid` is a 24px grid of hairline box rules; `dots-dark-green` is a two-layer offset polka-dot pattern on green `#bfe3bf`; `sprinkles` scatters 6-color cylindrical candy sprinkles (capsule rods with highlight shading) on frosting `#fdf3e3` — three mutually-prime inline-SVG tiles make the scatter read as random with no visible repeat; the other 13 `dots-*` types are pastel polka wallpapers whose base color matches Card's `pattern-*` series (`dots-pink`, `dots-purple`, `dots-blue`, `dots-yellow`, `dots-orange`, `dots-teal`, `dots-green`, `dots-red`, `dots-lime-green`, `dots-yellow-green`, `dots-brown`, `dots-warm-peach-pink`) plus `dots-gray` on a white base with light-gray dots. `sweet-corner` / `coffee-break` draw the 2560×1440 transparent-background scene SVGs (same as Progress `fill` scene variants) with `cover` sizing over a cream base — the SVG URL is injected as `backgroundImage` from the component. No fixed height — set `height` / `min-height` via `style`.

