# Feedback — 精确样式规范

反馈进度与等待状态的组件：Progress、Skeleton、BackTop 的精确取值

## Progress（描边轨道 + 渐变或场景图 fill）

源码：`src/components/Progress/Progress.tsx`（受控渲染 + aria 适配）+ `types.ts`（类型定义）+ `progress.module.less`。
**JSX 组件**（非命令式）：`percent` 受控传入，从 0 平滑动画到目标值。track 是奶油色 pill，带细波点纹理和 2px 沙色实描边；传 `variant` 时 fill 是场景图（`sweet-corner.svg`、`forest-grove.svg` …）由组件内联注入，`background-size` 等于整条轨道宽度，场景铺满整条轨道；未传 `variant` 时 fill 回退为薄荷色竖向渐变。百分比文字固定显示在进度条右侧。

**props**：
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=14px / middle=24px / large=32px
    showInfo?: boolean;         // default true；文字显示在进度条右侧
    variant?: ProgressVariant;  // fill 场景图；不传时用薄荷渐变
    infoFormat?: (p: number) => ReactNode; // default `${p}%`
    duration?: number;          // seconds; 0 disables the fill width animation; default 0.6
    className?: string;
    style?: CSSProperties;
}
```

**Track（精确值）：**
```css
.track {
    position: relative;
    box-sizing: border-box;  /* 高度含描边，保证 size 是总高 */
    flex: 1 1 auto;
    width: 100%;
    min-width: 80px;
    background:
        radial-gradient(circle, rgba(196, 184, 158, 0.1) 1.5px, transparent 1.5px) 7px 7px / 14px 14px,
        #f8f8f0;              /* 细奶油波点 + 未改动的奶油底 */
    border: 2px solid #e2d6bd; /* 沙色实描边（替掉原来的内凹阴影） */
    border-radius: 999px;    /* pill */
    overflow: hidden;
}
.track.size-small  { height: 14px; }
.track.size-middle { height: 24px; }
.track.size-large  { height: 32px; }
```

原来的壁纸轨道，小点层保留了 14px 网格、7px 偏移、`#f8f8f0` 底色和 `rgba(196, 184, 158, 0.1)`，但**点半径是 1.5px，不是原来的 1px**。2px 描边吃掉了 4px 画布（14px 的 small 档内腔只剩 10px），原半径的点在这个更小的画布里显得又小又稀，所以把点径调宽来补偿。1.5px / 28px 的粗大点层去掉了：描边已经在勾边，再叠一层更大的点会显脏。`background-origin` 保持默认的 `padding-box`，所以波点从描边内侧起画，不会压在描边下面。

**Fill（精确值）：**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    background: linear-gradient(180deg, #3dd4c6 0%, #19c8b9 60%, #14b6a8 100%); /* 薄荷色，上亮下沉 */
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.45);  /* 顶部内高光 */
    /* 传 variant 时由 Progress.tsx 内联注入场景图，覆盖渐变层：
       background-image: url(<variant svg>);
       background-repeat: no-repeat;
       background-position: left top;
       background-size: <trackWidth>px auto;  (图片铺满整条轨道，按进度从左裁剪) */
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

/* 100% 完成态：整体提亮，读作「已抵达」而不是「还在加载」。
   纯 CSS，挂在组件本来就渲染的 aria 值上。 */
.progress[aria-valuenow='100'] .fill {
    background: linear-gradient(180deg, #7fe0d5 0%, #3dd4c6 100%);
}
```

**Info 文字（进度条右侧）：**
```css
.row {
    display: flex; align-items: center; gap: 12px; width: 100%; flex: 1 1 auto; min-width: 0;
}
.info {
    font-weight: 700; color: #725d42; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.02em;
}
.info.right { min-width: 44px; text-align: right; }
```

**关键交互细节：**
- `duration=0` → 关闭 fill 宽度过渡（`transition: none`），瞬间到位。
- a11y：根 div 有 `role="progressbar"` + `aria-valuemin=0/aria-valuemax=100/aria-valuenow=<四舍五入后的 percent>/aria-valuetext=<infoFormat 的字符串结果>`。
- `prefers-reduced-motion: reduce` 时 fill 宽度过渡自动关闭。
- 不传 `variant` 时 `Progress.tsx` 仍会内联写入 `background-color: #19c8b9`；样式表里的渐变完全不透明、盖在其上，所以这个内联色只是兜底，不是实际观感。
- 100% 提亮只作用于渐变 fill。传了 `variant` 时场景图会内联注入自己的 `background-image`，100% 下刻意保持场景原色不染色。

## Loading

默认恢复黑底经典小岛加载页。原 SVG、GSAP 和 MotionPath 动画在带沙箱的 iframe 内运行，180 × 218px 场景位于右下角，距边缘 20px。脚本仅在挂载小岛时加载，每个实例独立管理全局变量、图形 ID 和动画生命周期。减少动态效果时静止展示小岛。关闭时从中心扩圆揭开页面，fadeDuration 后卸载。variant="snow" 保留落雪效果，继续支持延迟显示、退场中重新激活和卸载清理。

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

## Skeleton（流光占位）

源码：`src/components/Skeleton/Skeleton.tsx` + `skeleton.module.less`。

骨架屏加载占位组件。四种变体：`text` / `circle` / `rect` / `paragraph`。`loading=false` 时直接渲染 children。

**props**：
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

**样式精确值**：
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
.skeleton-avatar { border-radius: 50%; }             // shape="circle"（默认）；shape="square" → 12px，由 shape prop 以内联样式设置
```

**关键交互细节：**
- 流光动画是暖白色渐变，从左到右扫描，时长 1.6s。
- 所有圆角 ≥12px，符合「无锐角」规则。
- paragraph 模式最后一行默认宽 60%（可通 `rowWidths` 覆盖）。
- `aria-hidden` 屏蔽屏幕阅读器。

## BackTop

恢复历史 PNG 的 base64 图片。图片 alt 为空，可访问名称由可聚焦的外层按钮提供。图片尺寸 64 × 64px，保留暖色投影。滚动容器、显示阈值、键盘与平滑返回顶部行为保持可用。

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

## Countdown（截止倒计时）

源码：`src/components/Countdown/Countdown.tsx` + `countdown.module.less`。

组件计算 `value`（`number | Date`）与 `Date.now()` 的非负差值，每 250ms 刷新，使向上取整后的秒数准时变化。到零时 `onFinish` 只触发一次。

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date;
    format?: string; // 默认 'HH:mm:ss'；支持 DD / HH / mm / ss
    prefix?: ReactNode;
    size?: CountdownSize; // 默认 'middle'
    variant?: CountdownVariant; // 默认 'default'
    bordered?: boolean; // 默认 false — 数字块是否带 1.5px 细边框
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

默认风格是白色 20px 圆角面板、暖色边框和柔和投影；`island` 使用 `rgb(247,243,223)` 羊皮纸背景与 2px `#d4c4a8` 虚线边框。每个 DD / HH / mm / ss token 渲染为独立的 12px 圆角数字块（奶油渐变底 `linear-gradient(180deg, #fff, #f8f8f0)`；island 风格下为 `#fffdf4→#f8f8f0` 渐变底；1.5px `#d4c9b4` 细边框通过 `bordered` 属性开启，默认无边框），格式中的字面量（如 `:`、`天`）渲染为普通分隔符，冒号与数字同字号、900 字重、`#8b7355`。数字块内每一位数字是包含两轮 0-9 的纵向数字条，所有变化都以 0.35s `cubic-bezier(0.4, 0, 0.2, 1)` 过渡向下滚动（里程表式）；数字滚过 0 回绕时，数字条先无动画瞬移到下一循环的同数字位置，再继续向下滚动，方向永不反向。数字采用大地棕 `#8b7355`、900 字重、等宽数字，三档字号为 20/26/34px。滚动数字条对辅助技术隐藏，由视觉隐藏的完整格式化文本代替；根节点使用 `role="timer"` 与 `aria-live="off"`，避免读屏软件每 250ms 打断用户。

## Time

恢复横向旧时钟：奶油渐变底、3px 暖色边框、18px 圆角，内边距 16px / 36px。左侧纵向排列星期与月日，通过 3px 分隔线连接右侧 48px 棕色 HH:MM。手机下内边距为 12px / 20px，时钟缩至 32px。日期格式和实例级语言接口保持兼容，卸载时清理每秒定时器。

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

