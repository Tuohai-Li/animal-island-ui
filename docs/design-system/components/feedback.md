# Feedback — pixel spec

Exact values for the components that report progress or pending state: Progress, Skeleton and BackTop.

## Progress (outlined track, gradient or scene fill)

Source: `src/components/Progress/Progress.tsx` (controlled rendering + aria wiring) + `types.ts` (type definitions) + `progress.module.less`.
**A JSX component** (not imperative): `percent` is passed in controlled and animates smoothly from 0 to the target value. The track is a cream pill carrying a fine dot texture and a solid 2px sand outline; when a `variant` is passed the fill is a scene image (`sweet-corner.svg`, `forest-grove.svg`, …) injected inline at `background-size` equal to the full track width so the scene spans the whole bar, while omitting `variant` falls back to a mint vertical gradient. The label always sits right of the bar.

**props**:
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=14px / middle=24px / large=32px
    showInfo?: boolean;         // default true; label sits right of the bar
    variant?: ProgressVariant;  // scene image for the fill; omit to use the mint gradient
    infoFormat?: (p: number) => ReactNode; // default `${p}%`
    duration?: number;          // seconds; 0 disables the fill width animation; default 0.6
    className?: string;
    style?: CSSProperties;
}
```

**Track (exact values):**
```css
.track {
    position: relative;
    box-sizing: border-box;  /* height includes the border, so size = total height */
    flex: 1 1 auto;
    width: 100%;
    min-width: 80px;
    background:
        radial-gradient(circle, rgba(196, 184, 158, 0.1) 1.5px, transparent 1.5px) 7px 7px / 14px 14px,
        #f8f8f0;              /* fine cream dots over the unchanged cream base */
    border: 2px solid #e2d6bd; /* sand outline (replaces the old inset dent) */
    border-radius: 999px;    /* pill */
    overflow: hidden;
}
.track.size-small  { height: 14px; }
.track.size-middle { height: 24px; }
.track.size-large  { height: 32px; }
```

The small dot layer carries over from the old wallpaper track — 14px grid, 7px offset, `#f8f8f0` base, `rgba(196, 184, 158, 0.1)` — but the dot **radius is 1.5px, not the original 1px**. The 2px outline takes 4px off the canvas (the 14px `small` size leaves a 10px interior), so at the original radius the same dots read as smaller and sparser than they used to; widening the radius compensates. The coarser 1.5px / 28px layer was dropped: with the outline already drawing the edge, a second, larger dot layer reads as dirt. `background-origin` stays at its default `padding-box`, so the dots start inside the border rather than under it.

**Fill (exact values):**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    background: linear-gradient(180deg, #3dd4c6 0%, #19c8b9 60%, #14b6a8 100%); /* mint, top-lit */
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.45);  /* top inner highlight */
    /* scene image injected inline by Progress.tsx, replacing the gradient layer:
       background-image: url(<variant svg>);
       background-repeat: no-repeat;
       background-position: left top;
       background-size: <trackWidth>px auto;  (image spans the full track, clipped left by progress) */
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

/* 100% completion state — brighter, so a full bar reads as "arrived", not "loading".
   Pure CSS, keyed off the aria value the component already renders. */
.progress[aria-valuenow='100'] .fill {
    background: linear-gradient(180deg, #7fe0d5 0%, #3dd4c6 100%);
}
```

**Info text (right of the bar):**
```css
.row {
    display: flex; align-items: center; gap: 12px; width: 100%; flex: 1 1 auto; min-width: 0;
}
.info {
    font-weight: 700; color: #725d42; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.02em;
}
.info.right { min-width: 44px; text-align: right; }
```

**Key interaction details:**
- `duration=0` → the fill width transition is disabled (`transition: none`) and jumps instantly.
- a11y: the root div carries `role="progressbar"` plus `aria-valuemin=0` / `aria-valuemax=100` / `aria-valuenow=<rounded percent>` / `aria-valuetext=<string result of infoFormat>`.
- Under `prefers-reduced-motion: reduce`, the fill width transition is switched off automatically.
- Without a `variant`, `Progress.tsx` still sets an inline `background-color: #19c8b9`. The stylesheet gradient is fully opaque, so it paints on top and that inline color is only a paint-order fallback, not the visible result.
- The 100% brightening applies to the gradient fill only. A `variant` injects its own `background-image` inline and deliberately keeps the scene art un-tinted at 100%.

## Loading

Default: historical black island loading screen, with the original SVG, GSAP and MotionPath animation isolated in a sandboxed iframe. The 180 × 218px scene sits 20px from the bottom-right. Scripts load only while the island is mounted. Each frame owns its globals, IDs and animation lifecycle. Reduced motion leaves a static island. Hiding the screen uses a center-out circular reveal, then unmounts it after `fadeDuration`. `variant="snow"` retains the snow effect. Delay, reactivation and unmount cleanup remain supported.

```tsx
export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 经典小岛动画（默认），或雪花效果 */
    variant?: 'island' | 'snow';
    /** 是否开启雪花屏（true / false 控制开启关闭）；false 时渐变消失 */
    active?: boolean;
    /** 雪花屏中央提示文字 */
    tip?: React.ReactNode;
    /** 延迟显示时间（毫秒），避免加载快速结束时闪烁；0 = 立即显示 */
    delay?: number;
    /** 渐变消失时长（秒） */
    fadeDuration?: number;
    /** 全屏层级，默认 3000（高于 Notification 的 2000） */
    zIndex?: number;
}
```

## Skeleton (shimmer placeholder)

Source: `src/components/Skeleton/Skeleton.tsx` + `skeleton.module.less`.

Skeleton loading placeholder. Four variants: `text` / `circle` / `rect` / `paragraph`. When `loading=false` it renders `children` directly.

**props**:
```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // paragraph row count, default 3
    width?: number | string;     // text/circle/rect width
    rowWidths?: (number | string)[]; // paragraph per-row width array
    widthValue?: number | string;    // circle/rect width
    heightValue?: number | string;   // circle/rect height
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

// sub-components
SkeletonButtonProps { size?: 'small'|'middle'|'large'; active?: boolean; }
SkeletonInputProps  { size?: 'small'|'middle'|'large'; active?: boolean; }
SkeletonAvatarProps { size?: 'small'|'middle'|'large'; shape?: 'circle'|'square'; active?: boolean; }
```

**Exact styles**:
```less
// base colours
@bg-base: #eae5db;      // light beige grey
@bg-line: #dfd9ce;      // row colour, slightly darker

// shimmer (warm white)
@shimmer-light: rgba(255, 252, 242, 0.55);
@shimmer-mid: rgba(255, 250, 235, 0.18);

// shared
.skeleton {
    background: @bg-base;
    border-radius: 12px;            // minimum radius
    overflow: hidden;
    position: relative;
}

// shimmer animation
.active::after {
    background: linear-gradient(90deg, transparent, @shimmer-mid, @shimmer-light, @shimmer-mid, transparent);
    animation: animal-skeleton-shimmer 1.6s ease-in-out infinite;
}

// per-variant radius
.vt-text   { border-radius: 12px; height: 16px; }
.vt-circle { border-radius: 50%; }
.vt-rect   { border-radius: 18px; }
.vt-paragraph { background: none; }
.line      { border-radius: 12px; background: @bg-line; }

// sub-components
.skeleton-btn   { border-radius: 50px; }             // pill
.skeleton-input { border-radius: 50px; }             // pill
.skeleton-avatar { border-radius: 50%; }             // shape="circle" (default); shape="square" → 12px, set inline by the shape prop
```

**Key interaction details:**
- The shimmer is a warm-white gradient sweeping left to right over 1.6s.
- Every radius is ≥12px, satisfying the "no sharp corners" rule.
- In paragraph mode the last row defaults to 60% width (overridable via `rowWidths`).
- `aria-hidden` keeps it out of screen readers.

## BackTop

Uses the recovered historical PNG as an embedded base64 image, with empty alt text and the accessible name on its focusable parent. The image is 64 × 64px with a warm drop shadow. Existing scroll-container, threshold, keyboard and smooth-scroll behavior remains supported.

```tsx
export interface BackTopProps {
    /** 滚动容器，默认 window */
    target?: () => HTMLElement | Window;
    /** 滚动多少 px 后显示，默认 400 */
    visibilityHeight?: number;
    /** 点击回到顶部后的回调 */
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 滚动动画时长(ms)，默认 300 */
    duration?: number;
}
```

## Countdown (deadline timer)

Source: `src/components/Countdown/Countdown.tsx` + `countdown.module.less`.

The component calculates the non-negative distance between `value` (`number | Date`) and `Date.now()`, refreshing every 250ms so the displayed, ceiling-rounded second changes on time. `onFinish` fires once when the value reaches zero.

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date;
    format?: string; // default 'HH:mm:ss'; tokens DD / HH / mm / ss
    prefix?: ReactNode;
    size?: CountdownSize; // default 'middle'
    variant?: CountdownVariant; // default 'default'
    bordered?: boolean; // default false — draws the 1.5px digit-tile borders
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

The default variant is a white 20px-radius panel with a warm border and soft elevation. `island` uses the parchment background `rgb(247,243,223)` with a 2px dashed `#d4c4a8` border. Each DD / HH / mm / ss token renders as its own 12px-radius digit tile (a cream gradient face `linear-gradient(180deg, #fff, #f8f8f0)`; a `#fffdf4→#f8f8f0` gradient on the island variant; the 1.5px `#d4c9b4` border is opt-in via `bordered`, off by default) while format literals such as `:` or `天` render as plain separators. Colons are sized with the digits, 900 weight, `#8b7355`. Inside each tile every digit is a vertical strip of two 0-9 cycles; all changes roll downward with a 0.35s `cubic-bezier(0.4, 0, 0.2, 1)` transition (odometer style). When a digit wraps past 0, the strip instantly teleports to the same digit in the next cycle and keeps rolling down, so the direction never reverses. Digits use the earth-tone `#8b7355`, 900 weight, tabular, sized 20/26/34px. The rolling strips are `aria-hidden` and a visually-hidden span carries the full formatted value; the root uses `role="timer"` and `aria-live="off"` so screen readers are not interrupted four times per second.

## Time

Historical horizontal clock: a cream gradient panel, 3px warm border, 18px corners and 16px / 36px padding. Dates stack on the left of a 3px separator; 48px brown HH:MM digits sit on the right. At mobile widths, padding becomes 12px / 20px and clock digits 32px. Date formatting and per-instance locale remain compatible; the one-second timer clears on unmount.

```tsx
export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 星期格式，支持 dayjs 核心 token（dddd / ddd / dd 等），默认 dddd */
    weekdayFormat?: string;
    /** 月日格式，支持 dayjs 核心 token（YYYY / MMM / M / D / dddd 等），默认 MMM D，zh-cn 下默认 M月D日 */
    dateFormat?: string;
    /** 日期行语言，决定 dddd / MMM 输出的语言名，默认 en */
    locale?: TimeLocale;
}
```

