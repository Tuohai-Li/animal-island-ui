import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Wallet } from './Wallet';

describe('Wallet', () => {
    it('保留负数小数，支持不同分隔符和数值更新', () => {
        const { rerender } = render(<Wallet value={-1234567.89} />);
        expect(screen.getByText('-1,234,567.89')).toBeInTheDocument();
        rerender(<Wallet value={12345.6} thousandSeparator=" " />);
        expect(screen.getByText('12 345.6')).toBeInTheDocument();
        rerender(<Wallet value={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('字符串原样展示，允许自定义图标和原生属性', () => {
        render(<Wallet value="余额保密" icon={<span>星星</span>} aria-label="旅费" />);
        expect(screen.getByLabelText('旅费')).toHaveTextContent('余额保密');
        expect(screen.getByText('星星')).toBeInTheDocument();
    });
});
