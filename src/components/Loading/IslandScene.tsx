import React, { useEffect, useState } from 'react';
import illustration from './island/illustration.svg?raw';
import styles from './loading.module.less';

function frameDocument(scripts: string): string {
    return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}svg{width:100%;height:100%;display:block}</style></head><body>${illustration}${scripts}</body></html>`;
}

export function IslandScene() {
    const [document, setDocument] = useState(() => frameDocument(''));
    useEffect(() => {
        let disposed = false;
        let revision = 0;
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        const load = async () => {
            const currentRevision = ++revision;
            if (reduceMotion?.matches) {
                setDocument(frameDocument(''));
                return;
            }
            const modules = await Promise.all([
                import('./island/gsap.min.js?raw'),
                import('./island/MotionPathPlugin.min.js?raw'),
                import('./island/script.js?raw'),
            ]);
            if (!disposed && currentRevision === revision) {
                const scripts = modules
                    .map((module) => `<script>${module.default.replace(/<\/script/gi, '<\\/script')}</script>`)
                    .join('');
                setDocument(frameDocument(scripts));
            }
        };
        void load().catch(() => {
            if (!disposed) setDocument(frameDocument(''));
        });
        reduceMotion?.addEventListener?.('change', load);
        return () => {
            disposed = true;
            reduceMotion?.removeEventListener?.('change', load);
        };
    }, []);

    // The historical animation uses global IDs and GSAP; a frame isolates each instance and its cleanup.
    return (
        <iframe
            className={styles.islandScene}
            title="经典小岛加载动画"
            srcDoc={document}
            sandbox="allow-scripts"
            tabIndex={-1}
            aria-hidden="true"
        />
    );
}
