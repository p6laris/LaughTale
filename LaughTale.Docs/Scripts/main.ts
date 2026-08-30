/**
 * LaughTale Docs: Island Registration & Enhancements Entrypoint
 */

import { defineIsland, initIslands, initDirectives, enableViewTransitions } from '../../LaughTale.Client/src/index';

// 1. Register Core Docs Islands
defineIsland('interactive-counter', () => import('./islands/counter'));
defineIsland('file-dropzone', () => import('./islands/dropzone'));
defineIsland('cascade-tree', () => import('./islands/cascade-tree'));
defineIsland('event-broadcaster', () => import('./islands/broadcaster'));
defineIsland('event-receiver', () => import('./islands/receiver'));
defineIsland('modal-dialog', () => import('./islands/modal-dialog'));
defineIsland('persistent-telemetry', () => import('./islands/persistent-player'));

// 2. Register Live Polyglot Islands
defineIsland('polyglot-react', () => import('./islands/polyglot-react'));
defineIsland('polyglot-vue', () => import('./islands/polyglot-vue'));
defineIsland('polyglot-svelte', () => import('./islands/polyglot-svelte'));

// 3. Command Palette Spotlight Modal Handlers
export function openCommandPalette() {
    const backdrop = document.getElementById('command-palette-backdrop');
    if (backdrop) {
        backdrop.style.display = 'flex';
        const input = backdrop.querySelector('input');
        if (input) setTimeout(() => input.focus(), 50);
    }
}

export function closeCommandPalette() {
    const backdrop = document.getElementById('command-palette-backdrop');
    if (backdrop) {
        backdrop.style.display = 'none';
    }
}

// 4. Robust Single-Pass Syntax Lexer for Code Viewer
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function tokenizeCode(codeText: string, lang: string): string {
    const masterRegex = new RegExp(
        [
            '(?<comment>//[^\n]*|/\\*[\\s\\S]*?\\*/|<!--[\\s\\S]*?-->)',
            '(?<string>"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)',
            '(?<directive>\\b(?:l-state|l-bind|l-model|l-on|l-show|l-hide|l-class|l-style|l-get|l-post|l-target|l-swap|l-indicator|l-mask|l-copy|l-emit|l-listen|l-trigger)\\b|@[a-zA-Z_]\\w*)',
            '(?<tag></?[a-zA-Z0-9_-]+)',
            '(?<attr>\\b[a-zA-Z0-9_-]+(?=\\s*=))',
            '(?<keyword>\\b(?:import|export|default|from|function|const|let|var|return|class|record|struct|public|private|protected|static|readonly|async|await|new|this|typeof|instanceof|interface|type|extends|implements|namespace|using|switch|case|break|try|catch|throw|if|else|for|while|get|set)\\b)',
            '(?<typename>\\b(?:string|number|boolean|void|any|unknown|never|object|int|double|float|decimal|bool|char|byte|Task|ActionResult|List|Dictionary|IEnumerable|IslandContext|IslandDataRequest|IslandDataResult|HydrateStrategy|IslandFramework|PageModel)\\b)',
            '(?<fn>\\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\\s*\\())',
            '(?<number>\\b(?:true|false|null|undefined|\\d+(?:\\.\\d+)?)\\b)'
        ].join('|'),
        'g'
    );

    let result = '';
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = masterRegex.exec(codeText)) !== null) {
        if (match.index > lastIndex) {
            result += escapeHtml(codeText.slice(lastIndex, match.index));
        }

        const groups = (match as any).groups || {};
        const text = escapeHtml(match[0]);

        if (groups.comment) {
            result += `<span class="tok-comment">${text}</span>`;
        } else if (groups.string) {
            result += `<span class="tok-str">${text}</span>`;
        } else if (groups.directive) {
            result += `<span class="tok-directive">${text}</span>`;
        } else if (groups.tag) {
            result += `<span class="tok-tag">${text}</span>`;
        } else if (groups.attr) {
            result += `<span class="tok-attr">${text}</span>`;
        } else if (groups.keyword) {
            result += `<span class="tok-kw">${text}</span>`;
        } else if (groups.typename) {
            result += `<span class="tok-type">${text}</span>`;
        } else if (groups.fn) {
            result += `<span class="tok-fn">${text}</span>`;
        } else if (groups.number) {
            result += `<span class="tok-num">${text}</span>`;
        } else {
            result += text;
        }

        lastIndex = masterRegex.lastIndex;
    }

    if (lastIndex < codeText.length) {
        result += escapeHtml(codeText.slice(lastIndex));
    }

    return result;
}

function enhanceCodeBlocks() {
    document.querySelectorAll('.laughtale-markdown-content pre').forEach((pre) => {
        if (pre.closest('.code-window')) return;

        const codeEl = pre.querySelector('code');
        const rawCode = (codeEl ? (codeEl as HTMLElement).innerText : (pre as HTMLElement).innerText) || '';

        let lang = 'Code';
        const classList = (codeEl?.className || pre.className || '').split(/\s+/);
        for (const cls of classList) {
            if (cls.startsWith('language-')) {
                lang = cls.replace('language-', '').toUpperCase();
                if (lang === 'CS' || lang === 'CSHARP') lang = 'C#';
                if (lang === 'TS' || lang === 'TYPESCRIPT') lang = 'TypeScript';
                if (lang === 'JS' || lang === 'JAVASCRIPT') lang = 'JavaScript';
                if (lang === 'SH' || lang === 'SHELL') lang = 'BASH';
                break;
            }
        }

        const windowEl = document.createElement('div');
        windowEl.className = 'code-window';

        const headerEl = document.createElement('div');
        headerEl.className = 'code-window-header';
        headerEl.innerHTML = `
            <div class="code-window-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
            </div>
            <span class="code-window-lang">${lang}</span>
            <button type="button" class="code-copy-btn" title="Copy code snippet">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy</span>
            </button>
        `;

        const bodyEl = document.createElement('div');
        bodyEl.className = 'code-window-body';
        
        const newPre = document.createElement('pre');
        const newCode = document.createElement('code');
        newCode.innerHTML = tokenizeCode(rawCode, lang);
        newPre.appendChild(newCode);
        bodyEl.appendChild(newPre);

        const copyBtn = headerEl.querySelector('.code-copy-btn');
        copyBtn?.addEventListener('click', async () => {
            await navigator.clipboard.writeText(rawCode);
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Copied!</span>
            `;
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span>Copy</span>
                `;
            }, 2000);
        });

        windowEl.appendChild(headerEl);
        windowEl.appendChild(bodyEl);

        pre.parentNode?.replaceChild(windowEl, pre);
    });
}

function setupDocsEnhancements() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openCommandPalette();
        } else if (e.key === 'Escape') {
            closeCommandPalette();
        }
    });

    document.getElementById('command-palette-backdrop')?.addEventListener('click', closeCommandPalette);
    document.addEventListener('command-palette:open', openCommandPalette);

    enhanceCodeBlocks();

    const headings = document.querySelectorAll('.laughtale-markdown-content h2, .laughtale-markdown-content h3');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (headings.length > 0 && tocLinks.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(l => {
                        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '0px 0px -70% 0px' });

        headings.forEach(h => observer.observe(h));
    }
}

function initialize() {
    initIslands();
    initDirectives();
    enableViewTransitions();
    setupDocsEnhancements();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

window.addEventListener('island:page-loaded', setupDocsEnhancements);

console.log('[LaughTale] Docs client runtime initialized with polyglot islands.');
