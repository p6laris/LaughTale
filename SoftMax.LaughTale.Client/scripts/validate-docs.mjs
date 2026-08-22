import fs from 'fs';
import path from 'path';

const dir = '../SoftMax.LaughTale.Docs/content/docs';
const files = fs.readdirSync(dir);
const islandRegex = /<island\s+([^>]+)>/g;
const islandsFound = [];

for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    let match;
    while ((match = islandRegex.exec(content)) !== null) {
        const attrs = match[1];
        const nameMatch = attrs.match(/name=["']([^"']+)["']/);
        const propsMatch = attrs.match(/props-json='([^']+)'/) || attrs.match(/props-json="([^"]+)"/);
        const name = nameMatch ? nameMatch[1] : 'UNKNOWN';
        let validJson = true;
        if (propsMatch) {
            try {
                JSON.parse(propsMatch[1]);
            } catch (e) {
                validJson = false;
                console.error(`❌ INVALID JSON in ${file} for island '${name}':`, e.message);
            }
        }
        islandsFound.push({ file, name, validJson });
    }
}

console.log('✅ Total islands found in docs:', islandsFound.length);
const unique = [...new Set(islandsFound.map(i => i.name))];
console.log('Unique island names:', unique);
