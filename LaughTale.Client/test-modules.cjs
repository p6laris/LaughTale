const fs = require('fs');
const files = [
  'select.ts', 'checkbox.ts', 'radio-button.ts', 'textarea.ts',
  'menu.ts', 'carousel.ts', 'paginator.ts', 'sidebar.ts',
  'popover.ts', 'input-mask.ts', 'float-label.ts', 'context-menu.ts',
  'input-text.ts', 'dataview.ts', 'tooltip-component.ts'
];
for(const f of files) {
  console.log('Testing ' + f);
  const cp = require('child_process').spawnSync('npx.cmd', ['esbuild', 'src/components/' + f, '--bundle', '--outdir=dist/test-temp', '--platform=node', '--format=cjs', '--target=node20', '--packages=external']);
  if(cp.status !== 0) { console.log('build failed for', f); continue; }
  
  const jsFile = f.replace('.ts', '.js');
  const cp2 = require('child_process').spawnSync('node', ['-e', `require('./dist/test-temp/${jsFile}')`], {timeout: 3000});
  console.log(f, cp2.status === 0 ? 'OK' : 'FAILED');
}
