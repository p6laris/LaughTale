import fs from 'fs';
import path from 'path';

const dir = '../LaughTale.Docs/content/docs';
const files = fs.readdirSync(dir);
const islandRegex = /<island\s+([^>]+)>/g;

for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    let match;
    while ((match = islandRegex.exec(content)) !== null) {
        const attrs = match[1];
        const nameMatch = attrs.match(/name=["']([^"']+)["']/);
        const name = nameMatch ? nameMatch[1] : 'UNKNOWN';
        if (['mobile-drawer', 'sales-chart', 'settings-modal'].includes(name)) {
            console.log(`Found unmapped island '${name}' in file: ${file}`);
        }
    }
}
