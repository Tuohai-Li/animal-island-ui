# Layout components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Card

```ts
type CardType = 'default' | 'dashed';

type CardColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';
type CardPattern = 'none' | CardColor; // decorative overlay; same 13 values as CardColor

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: CardType; // default 'default'
    color?: CardColor; // default 'default'
    pattern?: CardPattern; // default 'none'
    hoverable?: boolean; // default false (no hover); true → cursor pointer + translateY(-2px) on hover
    children?: React.ReactNode;
}
```

Color → background / text: `default` rgb(247,243,223) / #725d42, `app-pink` #f8a6b2 / #fff, `purple` #b77dee / #fff, `app-blue` #889df0 / #fff, `app-yellow` #f7cd67 / #725d42, `app-orange` #e59266 / #fff, `app-teal` #82d5bb / #fff, `app-green` #8ac68a / #fff, `app-red` #fc736d / #fff, `lime-green` #d1da49 / #3d5a1a, `yellow-green` #ecdf52 / #725d42, `brown` #9a835a / #fff, `warm-peach-pink` #e18c6f / #fff.

```tsx
<Card>Default parchment card (read-only, no hover)</Card>
<Card hoverable>Interactive card (hover lifts -2px, cursor pointer)</Card>
<Card type="dashed">Draft / empty-state container</Card>
<Card color="app-yellow">Notification</Card>
<Card color="app-blue" pattern="app-pink">With decorative pattern overlay</Card>
```

Need a chapter/section heading? Use `<Title>` (ribbon banner). `Card type="title"` does not exist.

## Title

```ts
type TitleSize = 'small' | 'middle' | 'large';

type TitleColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

interface TitleProps {
    children: React.ReactNode; // REQUIRED
    size?: TitleSize; // default 'middle'
    color?: TitleColor; // default 'default'
    variant?: 'layer' | 'ribbon' | 'tab'; // default 'layer'
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Title>Chapter One</Title>
<Title size="large" color="app-yellow">Notification</Title>
<Title variant="layer" color="app-blue">Layer note</Title>
<Title variant="tab" color="lime-green">Corner tab</Title>
```

Renders an island-style ribbon banner (swallowtail clip-path ends + fold-shadow triangles + raised front). Uses the same 13 island palette as `Card.color`; `size` scales the whole ribbon via `em` units (small 14px / middle 20px / large 28px base). `variant` picks a same-family decoration that shares the `--rf / --rb / --rk / --rt` palette: `layer` (default, double-layer note: back sheet offset upper-left), `ribbon` (banner), or `tab` (corner tab: 135° gradient corner cut + dark fold triangle); every `.color-*` override applies equally to all three.

**Not supported:** no `level` (`h1..h6`) — renders as an inline-block `<div>`; no `bordered`; no `code` / `mark` / `underline` / `delete` modifiers (this is a decorative banner, NOT a generic typography-heading component).

## Divider

Default `line-brown` restores the historical image. `line-teal`, `line-white`, `line-yellow` and `wave-yellow` load recovered local assets; `zigzag` uses the recovered divider_line.png bitmap. Height is 12px (wave 14px). The modern thin/hairline/dashed/squiggle options remain accepted. `icon` accepts a historical icon name as well as a React element; string names render through the restored Icon component.

```tsx
export type DividerType = 'line-brown' | 'line-teal' | 'line-white' | 'line-yellow' | 'zigzag' | 'dashed-brown' | 'thin' | 'hairline' | 'wave-yellow' | 'squiggle';
export interface DividerProps {
    /** 分隔线类型（type 与 icon 二选一，icon 优先） */
    type?: DividerType;
    /** 传入图标元素（来自 naive-icons，如 `<FishIcon size={24} />`）；传入时渲染「图标 + 连接线」循环相连的装饰分割线，铺满整行 */
    icon?: React.ReactNode | IconName;
    /** 图标大小（px），同 Icon 默认 24 */
    iconSize?: number;
    /** 图标间距（px），即相邻图标之间的连接线长度，默认 8（紧密相连） */
    iconGap?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}
```

## Collapse

```ts
interface CollapseProps {
    question: React.ReactNode; // REQUIRED — header
    answer: React.ReactNode; // REQUIRED — body
    defaultExpanded?: boolean; // default false
    disabled?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Collapse question="What is Animal Island?" answer="A cozy React UI kit." />
<Collapse defaultExpanded question="FAQ #1" answer={<p>Long rich content…</p>} />
```

Uses a pure CSS grid-row transition — no JS height measurement, safe for SSR. Single panel only — no `accordion` / `items` group API; render multiple `<Collapse>` siblings if you need a list.

## Tabs

```ts
interface TabItem {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
}

interface TabsProps {
    items: TabItem[]; // REQUIRED
    defaultActiveKey?: string; // default: first tab
    activeKey?: string; // controlled mode
    onChange?: (key: string) => void;
    className?: string;
    style?: React.CSSProperties;
    leafAnimation?: boolean; // default true — active-tab leaf wiggle
}
```

```tsx
// Uncontrolled
<Tabs
    items={[
        { key: 'tab1', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
        { key: 'tab2', label: '昆虫', children: <p>蝴蝶、蜻蜓...</p> },
    ]}
    defaultActiveKey="tab1"
/>;

// Controlled
const [activeKey, setActiveKey] = useState('tab1');
<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />;
```

Supports both controlled and uncontrolled modes, with a smooth fade animation on tab switch.

**Not supported:** no `tabPosition` (always top), no `type="card"` / `type="editable-card"`, no `tabBarExtraContent`, no closable tabs.
