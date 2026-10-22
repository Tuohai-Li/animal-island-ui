import nunito700 from '../../assets/fonts/nunito-latin-700-normal.woff2?url';
import nunito900 from '../../assets/fonts/nunito-latin-900-normal.woff2?url';
import noto500 from '../../assets/fonts/noto-sans-sc-chinese-simplified-500-normal.woff2?url';
import noto700 from '../../assets/fonts/noto-sans-sc-chinese-simplified-700-normal.woff2?url';

const fonts = [
    ['Nunito', 700, nunito700],
    ['Nunito', 900, nunito900],
    ['Noto Sans SC', 500, noto500],
    ['Noto Sans SC', 700, noto700],
] as const;

async function embedFonts(): Promise<string> {
    return (
        await Promise.all(
            fonts.map(async ([family, weight, url]) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Unable to load invitation font: ${response.status}`);
                const blob = await response.blob();
                const data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result));
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(blob);
                });
                return `@font-face{font-family:'${family}';font-weight:${weight};src:url('${data}') format('woff2');}`;
            })
        )
    ).join('\n');
}

export async function exportInvitation(node: HTMLElement, filename: string): Promise<void> {
    const [{ domToPng }, fontCss] = await Promise.all([
        import('modern-screenshot'),
        embedFonts(),
        document.fonts.ready,
    ]);
    // Chromium snapshots need embedded font rules inside the captured subtree.
    const style = document.createElement('style');
    style.textContent = fontCss;
    node.prepend(style);
    try {
        const dataUrl = await domToPng(node, { scale: 2, font: { cssText: fontCss } });
        const anchor = document.createElement('a');
        anchor.href = dataUrl;
        anchor.download = filename.endsWith('.png') ? filename : `${filename}.png`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
    } finally {
        style.remove();
    }
}
