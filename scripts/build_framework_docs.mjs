import fs from 'node:fs';
import path from 'node:path';

const docsDir = path.resolve('LaughTale.Docs/content/docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

console.log('Target Docs Directory:', docsDir);
