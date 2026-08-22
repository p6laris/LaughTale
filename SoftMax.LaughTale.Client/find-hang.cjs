const { spawnSync } = require('child_process');
const fs = require('fs');
const content = fs.readFileSync('tests/phase2-components.test.ts', 'utf8');
const testNames = [];
let m;
const regex = /it\('([^']+)'/g;
while ((m = regex.exec(content)) !== null) {
  testNames.push(m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}
for (const name of testNames) {
  console.log('Running ' + name + ' in isolation...');
  const res = spawnSync('node', ['--test', 'dist/tests/phase2-components.test.js', '--test-name-pattern', '^' + name + '$'], { timeout: 3000 });
  if (res.status !== 0 || res.error) {
    console.log('FAILED OR HUNG: ' + name);
  } else {
    console.log('PASSED: ' + name);
  }
}
