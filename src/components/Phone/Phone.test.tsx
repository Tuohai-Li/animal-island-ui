import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setup } from '@test/utils';
import { Phone } from './Phone';

describe('Phone', () => {
    afterEach(() => vi.useRealTimers());

    it('支持键盘启动应用并返回应用标识', async () => {
        const user = setup();
        const onAppClick = vi.fn();
        render(<Phone greeting="欢迎回岛" onAppClick={onAppClick} />);
        expect(screen.getByText('欢迎回岛')).toBeInTheDocument();
        await user.tab();
        expect(screen.getByRole('button', { name: '相机' })).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(onAppClick).toHaveBeenCalledWith('camera');
        await user.click(screen.getByRole('button', { name: '地图' }));
        expect(onAppClick).toHaveBeenLastCalledWith('map');
    });

    it('跨过中午时时钟更新，卸载时清理定时器', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 9, 23, 11, 59, 59));
        const { unmount } = render(<Phone />);
        expect(screen.getByLabelText('11:59 AM')).toBeInTheDocument();
        act(() => vi.advanceTimersByTime(1000));
        expect(screen.getByLabelText('12:00 PM')).toBeInTheDocument();
        unmount();
        expect(vi.getTimerCount()).toBe(0);
    });
});
