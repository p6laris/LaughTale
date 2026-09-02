import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    html,
    escapeHtml,
    setHtml,
    unsafe,
    url,
    cx,
    attr,
    Raw
} from '../../src/runtime/html.ts';

describe('Safe HTML Rendering Primitive Suite (LT-902)', () => {

    // --- Escaping matrix ----------------------------------------------------

    it('escapes angle brackets so injected markup renders as text, not elements', () => {
        const hostile = '<script>window.__pwned = 1;</script>';
        const out = html`<div>${hostile}</div>`.value;

        assert.equal(out, '<div>&lt;script&gt;window.__pwned = 1;&lt;/script&gt;</div>');
        assert.ok(!out.includes('<script>'), 'raw script tag must not survive interpolation');

        const host = document.createElement('div');
        setHtml(host, html`<div>${hostile}</div>`);
        assert.equal(host.querySelectorAll('script').length, 0, 'no live script element created');
        assert.equal(host.textContent, hostile, 'the payload is visible as literal text');
    });

    it('escapes double quotes so an interpolation cannot terminate an enclosing attribute', () => {
        const breakout = 'x" onerror="boom';
        const out = html`<img alt="${breakout}">`.value;

        assert.equal(out, '<img alt="x&quot; onerror=&quot;boom">');

        const host = document.createElement('div');
        setHtml(host, html`<img alt="${breakout}">`);
        const img = host.querySelector('img');
        assert.ok(img, 'img element exists');
        assert.equal(img.getAttribute('onerror'), null, 'no attribute was injected');
        assert.equal(img.getAttribute('alt'), breakout, 'value survives intact as data');
    });

    it("escapes single quotes so an interpolation cannot terminate a single-quoted attribute", () => {
        const breakout = "x' onerror='boom";
        const out = html`<img alt='${breakout}'>`.value;

        assert.equal(out, "<img alt='x&#39; onerror=&#39;boom'>");
        assert.ok(!out.includes("onerror='"), 'no unescaped single-quoted attribute break');
    });

    it('escapes ampersands exactly once and does not double-encode on repeat renders', () => {
        const value = 'Tom & Jerry';

        const first = html`<p>${value}</p>`;
        assert.equal(first.value, '<p>Tom &amp; Jerry</p>');

        // Re-rendering the same source value must produce identical output.
        const second = html`<p>${value}</p>`;
        assert.equal(second.value, first.value, 'repeat render is stable');

        // A Raw result fed back in is passed through, not re-escaped.
        const nested = html`<div>${first}</div>`;
        assert.equal(nested.value, '<div><p>Tom &amp; Jerry</p></div>');
        assert.ok(!nested.value.includes('&amp;amp;'), 'no double-encoding');
    });

    // --- Value coercion -----------------------------------------------------

    it('renders null and undefined as the empty string, not their names', () => {
        assert.equal(html`<i>${null}</i>`.value, '<i></i>');
        assert.equal(html`<i>${undefined}</i>`.value, '<i></i>');
        assert.equal(escapeHtml(null), '');
        assert.equal(escapeHtml(undefined), '');
    });

    it('renders false as empty but renders 0 as "0"', () => {
        assert.equal(html`<i>${false}</i>`.value, '<i></i>');
        assert.equal(html`<i>${0}</i>`.value, '<i>0</i>');
        assert.equal(html`<i>${''}</i>`.value, '<i></i>');
    });

    it('renders arrays element-wise with escaping and no separator', () => {
        const items = ['a<b', 'c&d'];
        assert.equal(html`<ul>${items}</ul>`.value, '<ul>a&lt;bc&amp;d</ul>');

        // The pervasive list-building pattern must compose without double-escaping.
        const rows = [{ label: '<x>' }, { label: '&y' }];
        const out = html`<ul>${rows.map(r => html`<li>${r.label}</li>`)}</ul>`.value;
        assert.equal(out, '<ul><li>&lt;x&gt;</li><li>&amp;y</li></ul>');
    });

    // --- Escape hatches -----------------------------------------------------

    it('passes trusted markup through unsafe() verbatim', () => {
        const icon = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>';
        const out = html`<span>${unsafe(icon)}</span>`.value;

        assert.equal(out, `<span>${icon}</span>`);
        assert.ok(unsafe(icon) instanceof Raw, 'unsafe returns a Raw marker');
    });

    it('neutralises script-scheme URLs and preserves ordinary paths', () => {
        assert.equal(url('javascript:alert(1)').value, 'about:blank');
        assert.equal(url('vbscript:msgbox(1)').value, 'about:blank');
        assert.equal(url('/docs/getting-started').value, '/docs/getting-started');
        assert.equal(url('https://example.com/a?b=1&c=2').value, 'https://example.com/a?b=1&amp;c=2');
        assert.equal(url(null).value, '', 'nullish url yields empty, not the string "null"');

        const host = document.createElement('div');
        setHtml(host, html`<a href="${url('javascript:alert(1)')}">go</a>`);
        assert.equal(host.querySelector('a')?.getAttribute('href'), 'about:blank');
    });

    // --- Attribute & class helpers -----------------------------------------

    it('attr() emits a safe attribute or nothing, replacing the conditional-attribute vector', () => {
        assert.equal(attr('style', 'color: red').value, 'style="color: red"');
        assert.equal(attr('style', null).value, '', 'absent value emits nothing');
        assert.equal(attr('style', '').value, '', 'empty value emits nothing');
        assert.equal(attr('disabled', true).value, 'disabled', 'boolean true emits the bare name');
        assert.equal(attr('disabled', false).value, '', 'boolean false emits nothing');

        // The message.ts pattern: `${p.style ? `style="${p.style}"` : ''}`
        const hostile = 'x" onload="boom';
        const out = html`<div ${attr('style', hostile)}></div>`.value;
        assert.equal(out, '<div style="x&quot; onload=&quot;boom"></div>');

        const host = document.createElement('div');
        setHtml(host, html`<div ${attr('style', hostile)}></div>`);
        assert.equal(host.firstElementChild?.getAttribute('onload'), null, 'no injected handler');
    });

    it('cx() joins truthy class names and escapes them', () => {
        assert.equal(cx('p-tag', false, null, 'p-tag-info').value, 'p-tag p-tag-info');
        assert.equal(cx('a"b').value, 'a&quot;b');
        assert.equal(cx().value, '');
    });

    // --- The sanctioned DOM sink -------------------------------------------

    it('setHtml treats a plain string as text and Raw as markup', () => {
        const host = document.createElement('div');

        setHtml(host, '<b>not markup</b>');
        assert.equal(host.querySelectorAll('b').length, 0, 'plain strings are escaped');
        assert.equal(host.textContent, '<b>not markup</b>');

        setHtml(host, html`<b>markup</b>`);
        assert.equal(host.querySelectorAll('b').length, 1, 'Raw is written as markup');

        setHtml(host, '');
        assert.equal(host.innerHTML, '', 'clearing still works');
    });
});
