import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../../src/components');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

// 1. Gather all hex occurrences
const hexCounts = {};

for (const file of files) {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
    const matches = content.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    for (const m of matches) {
        const hex = m.toLowerCase();
        hexCounts[hex] = (hexCounts[hex] || 0) + 1;
    }
}

console.log('Total unique hex colors found:', Object.keys(hexCounts).length);
console.log('Total hex occurrences:', Object.values(hexCounts).reduce((a, b) => a + b, 0));
console.log('\nTop 30 hex colors:');
console.log(
    Object.entries(hexCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join('\n')
);
