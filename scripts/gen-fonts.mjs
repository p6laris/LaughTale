#!/usr/bin/env node
/**
 * LaughTale: Font Self-Hosting Generator (ROADMAP.v5.md Part H "font optimization")
 *
 * Downloads a Google Fonts family/weight set ONCE and rewrites it into a local, self-hosted
 * @font-face stylesheet + woff2 files - the same "self-host at build time" approach `next/font` and
 * Astro's font tooling take, closing the real gap this repo had: every app (`LaughTale.Showcase`,
 * `LaughTale.Docs`) was loading Geist/Inter/JetBrains Mono/Outfit/Plus Jakarta Sans from
 * fonts.googleapis.com/fonts.gstatic.com on every page load - a third-party network round trip
 * (render-blocking despite the existing preconnect/preload hints), and a visitor IP sent to Google
 * that self-hosting avoids entirely.
 *
 * Deliberately an AUTHOR-RUN, one-time generator - not a step in the normal `npm run build` pipeline.
 * A live network fetch on every build is a real, avoidable CI fragility (no existing script in this
 * repo does one; `gen-icons.mjs` reads from an already-installed npm package instead). Run this
 * manually whenever the font set changes, commit the generated files as real static assets - exactly
 * how the already-committed `wwwroot/fonts/speda/Speda-Bold.ttf` got there.
 *
 * Usage: node scripts/gen-fonts.mjs <output-dir>
 *   e.g. node scripts/gen-fonts.mjs LaughTale.Showcase/wwwroot
 *        node scripts/gen-fonts.mjs LaughTale.Docs/wwwroot
 */
import * as fs from 'fs';
import * as path from 'path';

// Matches the exact family/weight set already loaded from Google Fonts in both
// LaughTale.Showcase/Pages/_Layout.cshtml and LaughTale.Docs/Pages/_Layout.cshtml (and their
// site.css/docs.css @import) - not a guessed or reduced set.
const GOOGLE_FONTS_FAMILY_QUERY =
    'family=Geist:wght@300;400;500;600;700;800' +
    '&family=Inter:wght@300;400;500;600;700;800' +
    '&family=JetBrains+Mono:wght@400;500;600;700' +
    '&family=Outfit:wght@400;500;600;700;800' +
    '&family=Plus+Jakarta+Sans:wght@400;500;600;700;800' +
    '&display=swap';

// Google serves woff2 only to a UA it recognizes as a modern browser - without this, the CSS2
// endpoint falls back to woff/ttf, which every real target browser here doesn't need.
const MODERN_BROWSER_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function main() {
    const outDir = process.argv[2];
    if (!outDir) {
        console.error('Usage: node scripts/gen-fonts.mjs <output-dir>  (e.g. LaughTale.Showcase/wwwroot)');
        process.exit(1);
    }

    const fontsDir = path.join(outDir, 'fonts', 'generated');
    const cssDir = path.join(outDir, 'css');
    fs.mkdirSync(fontsDir, { recursive: true });
    fs.mkdirSync(cssDir, { recursive: true });

    console.log('⚡ [LaughTale] Fetching Google Fonts CSS2 manifest...');
    const cssUrl = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS_FAMILY_QUERY}`;
    const cssRes = await fetch(cssUrl, { headers: { 'User-Agent': MODERN_BROWSER_UA } });
    if (!cssRes.ok) {
        throw new Error(`Google Fonts CSS2 request failed: ${cssRes.status} ${cssRes.statusText}`);
    }
    const rawCss = await cssRes.text();

    // Each @font-face block's src url() points at a unique, content-hashed gstatic.com woff2 file.
    // Downloading by URL (not by parsing family/weight separately) is what makes this robust against
    // Google's own internal file-naming/versioning changes - we never need to know their scheme.
    const fontUrls = [...rawCss.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(m => m[1]);
    const uniqueUrls = [...new Set(fontUrls)];
    console.log(`⚡ [LaughTale] Downloading ${uniqueUrls.length} woff2 files...`);

    const urlToLocalName = new Map();
    let downloaded = 0;
    for (const url of uniqueUrls) {
        // The gstatic path's own filename segment is already a stable, unique, content-derived
        // identifier (e.g. "UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2") - reused as-is rather than
        // inventing a new naming scheme, so re-running this script against an unchanged font set
        // produces byte-identical output.
        const fileName = url.split('/').pop();
        urlToLocalName.set(url, fileName);

        const destPath = path.join(fontsDir, fileName);
        if (fs.existsSync(destPath)) {
            continue; // already downloaded in a previous run - Google's URLs are content-addressed, safe to skip
        }

        const fontRes = await fetch(url);
        if (!fontRes.ok) {
            throw new Error(`Failed to download font file ${url}: ${fontRes.status}`);
        }
        const buffer = Buffer.from(await fontRes.arrayBuffer());
        fs.writeFileSync(destPath, buffer);
        downloaded++;
    }
    console.log(`⚡ [LaughTale] Downloaded ${downloaded} new file(s), ${uniqueUrls.length - downloaded} already present.`);

    // Rewrite every gstatic.com url() to the local, self-hosted path. font-display/unicode-range/
    // weight/style are preserved verbatim - only the network origin changes.
    let localCss = rawCss;
    for (const [url, fileName] of urlToLocalName) {
        localCss = localCss.split(url).join(`/fonts/generated/${fileName}`);
    }

    const header =
        `/* LaughTale: self-hosted Google Fonts (ROADMAP.v5.md Part H "font optimization").\n` +
        ` * Generated by scripts/gen-fonts.mjs - do not hand-edit. Re-run that script to update.\n` +
        ` * Fetched from: ${cssUrl}\n` +
        ` */\n`;

    const outCssPath = path.join(cssDir, 'fonts.generated.css');
    fs.writeFileSync(outCssPath, header + localCss);
    console.log(`✅ [LaughTale] Wrote ${outCssPath} (${uniqueUrls.length} @font-face rules, self-hosted).`);
}

main().catch((err) => {
    console.error('❌ [LaughTale] gen-fonts.mjs failed:', err);
    process.exit(1);
});
