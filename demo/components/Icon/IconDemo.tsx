import React, { useState } from 'react';
import { Button, Icon, ICON_LIST, ITEM_LIST, ITEM_COUNT, Input } from '../../../src';
import { CodeBlock } from '../../tools';

export default function IconDemo() {
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(60);
    const [selected, setSelected] = useState('');
    const normalized = query.trim().toLowerCase();
    const names = ICON_LIST.filter((entry) => `${entry.name} ${entry.label}`.toLowerCase().includes(normalized));
    const items = ITEM_LIST.filter((id) => String(id).includes(normalized));
    return (
        <div style={{ background: '#fffdf8', padding: 24, borderRadius: 24 }}>
            <h2 style={{ fontSize: 20 }}>经典内置图标</h2>
            <p>
                已恢复 {ICON_LIST.length} 个应用图标和 {ITEM_COUNT} 个物品位图，资源随组件库本地打包。
            </p>
            <Input
                aria-label="搜索经典图标"
                placeholder="搜索名称或物品编号"
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setLimit(60);
                }}
            />
            <p role="status">{selected ? `已选择：${selected}` : '点击图标查看对应调用方式'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 12 }}>
                {names.map((entry) => (
                    <button
                        key={entry.name}
                        type="button"
                        aria-label={entry.name}
                        onClick={() => setSelected(`<Icon name="${entry.name}" />`)}
                        style={{
                            display: 'grid',
                            placeItems: 'center',
                            gap: 10,
                            padding: 16,
                            border: 0,
                            borderRadius: 16,
                            background: '#f3efdf',
                            color: '#794f27',
                            cursor: 'pointer',
                        }}
                    >
                        <Icon name={entry.name} size={42} bounce />
                        <span style={{ fontSize: 10 }}>{entry.label}</span>
                    </button>
                ))}
                {items.slice(0, limit).map((id) => (
                    <button
                        key={id}
                        type="button"
                        aria-label={`物品 ${id}`}
                        onClick={() => setSelected(`<Icon item={${id}} />`)}
                        style={{
                            display: 'grid',
                            placeItems: 'center',
                            gap: 10,
                            padding: 16,
                            border: 0,
                            borderRadius: 16,
                            background: '#f3efdf',
                            color: '#794f27',
                            cursor: 'pointer',
                        }}
                    >
                        <Icon item={id} size={42} bounce />
                        <span style={{ fontSize: 10 }}>Item {id}</span>
                    </button>
                ))}
            </div>
            {!names.length && !items.length && <p>没有匹配的图标。</p>}
            {items.length > limit && (
                <Button style={{ marginTop: 20 }} onClick={() => setLimit((value) => value + 60)}>
                    显示更多物品图标
                </Button>
            )}
            <CodeBlock code={selected || '<Icon name="icon-miles" size={32} bounce />\n<Icon item={1} size={40} />'} />
        </div>
    );
}
