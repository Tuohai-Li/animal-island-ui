# Feedback components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Progress

Horizontal bar whose fill defaults to a **mint vertical gradient** (`#3dd4c6 → #19c8b9 → #14b6a8`, top-lit, plus a `rgba(255,255,255,0.45)` inner highlight); when a `variant` is passed it becomes a **scene image** (`sweet-corner.svg`, `forest-grove.svg`, …) injected inline at `background-size` equal to the full track width, so the scene spans the whole bar; the fill is clipped from the left by progress width ("unveils from the left"). The track is a **cream pill** (`#f8f8f0`) carrying the old wallpaper track's fine dot texture — 1.5px-radius dots on a 14px grid, `rgba(196,184,158,0.1)`, base unchanged — inside a solid 2px sand outline (`#e2d6bd`); `box-sizing: border-box` means `size` is the total height including the border, so the dot radius is 1.5px rather than the pre-outline 1px to stay legible in the 4px the border takes. At `percent=100` the gradient fill brightens to `#7fe0d5 → #3dd4c6` so a full bar reads as finished, not loading. The percent label always sits **right of the bar**.

```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number; // REQUIRED, 0-100, clamped; non-integer rounded for aria
    size?: ProgressSize; // default 'middle' (small=14px, middle=24px, large=32px)
    showInfo?: boolean; // default true; label sits right of the bar
    variant?: ProgressVariant; // fill scene image; omit to use the mint gradient
    infoFormat?: (percent: number) => React.ReactNode; // default `${percent}%`
    duration?: number; // fill WIDTH transition in seconds; 0 disables; default 0.6
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Progress percent={50} size="large" />
<Progress percent={45} variant="forest-grove" />          {/* no variant = mint gradient fill */}
<Progress percent={50} infoFormat={(p) => `${Math.round(p / 10)} / 10`} />
<Progress percent={pct} duration={0} />                   {/* no fill-width animation */}
<Progress percent={66} showInfo={false} />
```

Notes:

- **Always provide `percent`.** Out-of-range values are clamped to `[0, 100]`. NaN is treated as `0`. The aria value is rounded.
- **Label position is fixed `right`** — it sits in a flex row after the track, right-aligned (`min-width: 44px`).
- **Fill scene image is fixed per `variant`** — there is no `status` / `strokeColor` / `leafAnimated` prop.
- **Fill width transition** animates on `percent` change (`duration` prop, default 0.6s, `0` disables) with `cubic-bezier(0.4, 0, 0.2, 1)`; disabled under `prefers-reduced-motion: reduce`.
- **Accessibility**: root has `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<rounded percent>`, and `aria-valuetext` set to the rendered text when it's a string.

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

## Skeleton

Loading placeholder rendering gray/beige blocks with a shimmer animation. When `loading` is `false`, children are rendered directly.

```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // for 'paragraph', default 3
    width?: number | string;     // for 'text'/'circle'/'rect'
    rowWidths?: (number | string)[]; // for 'paragraph', per-line widths
    widthValue?: number | string;    // for 'circle'/'rect'
    heightValue?: number | string;   // for 'circle'/'rect'
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;  // rendered when loading=false
}

// Sub-components
interface SkeletonButtonProps { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonInputProps  { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonAvatarProps { size?: 'small' | 'middle' | 'large'; shape?: 'circle' | 'square'; active?: boolean; }
```

```tsx
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from 'animal-island-ui';

<Skeleton variant="text" width="80%" />
<Skeleton variant="circle" widthValue={44} />
<Skeleton variant="rect" widthValue={200} heightValue={120} />
<Skeleton variant="paragraph" rows={4} />
<SkeletonButton size="middle" />
<SkeletonInput size="large" />
<SkeletonAvatar size="small" shape="square" />
<Skeleton loading={fetching}><div>Content loaded</div></Skeleton>
```

Notes:

- **Shimmer**: a warm-ivory `linear-gradient(90deg, transparent, rgba(255,252,235,0.18), rgba(255,252,242,0.55), ...)` sweeps left-to-right over 1.6s.
- **Shapes**: `circle` is 50% rounded; `rect` uses 18px radius; `text` uses 12px radius (matching the "no sharp corners" rule).
- **All sub-components** (`SkeletonButton`, `SkeletonInput`, `SkeletonAvatar`) share the same `active` shimmer and light-beige background.
- **A11y**: the skeleton root is marked `aria-hidden` to hide it from screen readers when `loading=true`.

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

## Countdown

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date; // REQUIRED — absolute deadline
    format?: string; // default 'HH:mm:ss'; DD / HH / mm / ss tokens
    prefix?: React.ReactNode;
    size?: CountdownSize; // default 'middle'
    variant?: CountdownVariant; // default 'default'
    bordered?: boolean; // default false — draws the 1.5px digit-tile borders
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

```tsx
<Countdown value={Date.now() + 60_000} />
<Countdown value={deadline} format="DD 天 HH:mm:ss" prefix="活动结束还有" variant="island" />
```

The remaining time never drops below zero and `onFinish` fires once. Without a `DD` token, `HH` is total hours; with `DD`, hours are the 0–23 remainder. Each DD / HH / mm / ss token renders as its own 12px-radius digit tile; every digit inside is a vertical strip of two 0-9 cycles that always rolls downward to the current value with a 0.35s transition (odometer style — wrapping past 0 teleports to the next cycle and keeps rolling down, never reversing). Format literals such as `:` or `天` render as plain separators. The rolling strips are `aria-hidden`; a visually-hidden span carries the full formatted value. The root is `role="timer"` with `aria-live="off"`.

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

