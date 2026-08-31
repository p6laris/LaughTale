import fs from 'fs';

// Generate SVG with explicit dimensions and colors
const svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="64" height="64" fill="none">
  <rect width="100" height="100" rx="20" fill="#0f172a" />
  <path d="M26 18 L42 18 C42 44 62 58 84 58 L84 74 C52 74 26 52 26 18 Z" fill="#10b981" />
  <circle cx="34" cy="74" r="6" fill="#10b981" />
</svg>;

fs.writeFileSync('LaughTale.Showcase/wwwroot/favicon.svg', svg);
fs.writeFileSync('LaughTale.Docs/wwwroot/favicon.svg', svg);

// Also write favicon.ico placeholder
fs.writeFileSync('LaughTale.Showcase/wwwroot/favicon.ico', svg);
fs.writeFileSync('LaughTale.Docs/wwwroot/favicon.ico', svg);

console.log('Favicons generated successfully.');