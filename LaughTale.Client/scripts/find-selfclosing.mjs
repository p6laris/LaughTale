import fs from 'fs';
import path from 'path';

const dir = '../LaughTale.Docs/content/docs';
const files = fs.readdirSync(dir);

for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const selfClosingMatches = content.match(/<island\s+[^>]*\/>/g);
    if (selfClosingMatches) {
        console.log(`Found self-closing <island /> in ${file}:`, selfClosingMatches);
    }
}
