import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon, ICON_LIST, ITEM_LIST, ITEM_COUNT } from './index';
import styles from './icon.module.less';

describe('Icon', () => {
    it('恢复十个应用图标与 488 个真实物品编号', () => {
        expect(ICON_LIST).toHaveLength(10);
        expect(ITEM_COUNT).toBe(488);
        expect(ITEM_LIST[0]).toBe(1);
        const { rerender } = render(<Icon item={ITEM_LIST[0]} aria-label="物品" />);
        expect(screen.getByRole('img', { name: '物品' }).style.backgroundImage).toContain('item-001.png');
        rerender(<Icon item={ITEM_LIST[ITEM_LIST.length - 1]} aria-label="物品" />);
        expect(screen.getByRole('img', { name: '物品' }).style.backgroundImage).toContain('.png');
    });

    it('装饰图标默认隐藏，具名图标支持 ref 与原生属性', () => {
        const ref = React.createRef<HTMLSpanElement>();
        const { rerender } = render(<Icon name="icon-camera" ref={ref} size={42} bounce />);
        expect(ref.current).toHaveClass(styles['icon-camera'], styles['icon-bounce']);
        expect(ref.current).toHaveAttribute('aria-hidden', 'true');
        rerender(<Icon name="icon-camera" ref={ref} aria-label="相机" data-scope="classic" />);
        expect(screen.getByRole('img', { name: '相机' })).toHaveAttribute('data-scope', 'classic');
    });

    it('未知物品编号不会生成损坏的图片 URL', () => {
        const { container } = render(<Icon item={999999} />);
        expect((container.firstChild as HTMLElement).style.backgroundImage).toBe('');
    });
});
