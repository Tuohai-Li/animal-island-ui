import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setup } from '@test/utils';
import { WeddingInvitation, WeddingInvitationExportButton, type WeddingInvitationRef } from './WeddingInvitation';
import { exportInvitation } from './exportImage';

vi.mock('./exportImage', () => ({ exportInvitation: vi.fn().mockResolvedValue(undefined) }));
vi.mock('modern-screenshot', () => ({ domToPng: vi.fn() }));

describe('请柬图片导出', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('内嵌字体后下载 PNG，并清理临时样式', async () => {
        const { exportInvitation: realExport } = await vi.importActual<typeof import('./exportImage')>('./exportImage');
        const { domToPng } = await import('modern-screenshot');
        const node = document.createElement('div');
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
            this: HTMLAnchorElement
        ) {
            expect(this.download).toBe('invitation.png');
        });
        Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: Promise.resolve() } });
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: async () => new Blob(['font']) }));
        vi.mocked(domToPng).mockImplementation(async () => {
            expect(node.querySelector('style')?.textContent).toContain('@font-face');
            return 'data:image/png;base64,example';
        });
        await realExport(node, 'invitation');
        expect(domToPng).toHaveBeenCalledWith(node, expect.objectContaining({ scale: 2 }));
        expect(click).toHaveBeenCalledOnce();
        expect(node.querySelector('style')).toBeNull();
    });

    it('截图失败时仍然移除临时字体样式', async () => {
        const { exportInvitation: realExport } = await vi.importActual<typeof import('./exportImage')>('./exportImage');
        const { domToPng } = await import('modern-screenshot');
        const node = document.createElement('div');
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: async () => new Blob(['font']) }));
        vi.mocked(domToPng).mockRejectedValueOnce(new Error('render failed'));
        await expect(realExport(node, 'invitation.png')).rejects.toThrow('render failed');
        expect(node.querySelector('style')).toBeNull();
    });

    it('字体请求失败时返回可重试的错误', async () => {
        const { exportInvitation: realExport } = await vi.importActual<typeof import('./exportImage')>('./exportImage');
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
        await expect(realExport(document.createElement('div'), 'invitation')).rejects.toThrow('503');
    });
});

describe('WeddingInvitation', () => {
    it('姓名更新和抽奖券开关保持一致', () => {
        const { rerender } = render(<WeddingInvitation brideName="阿晴" groomName="阿森" lotteryNumber="1234" />);
        expect(screen.getByRole('article', { name: '阿晴与阿森的婚礼请柬' })).toBeInTheDocument();
        expect(screen.getByText('婚礼抽奖券')).toBeInTheDocument();
        rerender(<WeddingInvitation brideName="小夏" groomName="阿森" showLotteryNumber={false} />);
        expect(screen.getByText('小夏')).toBeInTheDocument();
        expect(screen.queryByText('婚礼抽奖券')).not.toBeInTheDocument();
    });

    it('导出使用真实请柬节点和指定文件名', async () => {
        const user = setup();
        const ref = React.createRef<WeddingInvitationRef>();
        render(
            <>
                <WeddingInvitation ref={ref} />
                <WeddingInvitationExportButton targetRef={ref} filename="our-island" />
            </>
        );
        await user.click(screen.getByRole('button', { name: '保存为图片' }));
        await waitFor(() => expect(exportInvitation).toHaveBeenCalledWith(ref.current?.getElement(), 'our-island'));
    });

    it('导出失败时显示错误并恢复重试入口', async () => {
        const user = setup();
        const failure = new Error('offline');
        const onError = vi.fn();
        const ref = { current: { exportAsImage: vi.fn().mockRejectedValue(failure), getElement: () => null } };
        render(<WeddingInvitationExportButton targetRef={ref} onError={onError} />);
        await user.click(screen.getByRole('button', { name: '保存为图片' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('图片导出失败');
        expect(screen.getByRole('button', { name: '保存为图片' })).toBeEnabled();
        expect(onError).toHaveBeenCalledWith(failure);
    });
});
