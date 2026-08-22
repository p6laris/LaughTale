const fs = require('fs');
const path = require('path');

const files = [
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/accordion.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/autocomplete.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/avatar-group.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/blockui.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/breadcrumb.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/chips.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/color-picker.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/command.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/confirm-popup.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/datagrid.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/datepicker.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/dock.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/drawer.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/dropzone.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/dynamic-form.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/galleria.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/image-compare.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/inplace.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/input-number.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/input-otp.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/input-password.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/knob.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/listbox.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/meter-group.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/modal.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/multiselect.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/orderlist.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/orgchart.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/picklist.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/progress-bar.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/rating.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/scroll-top.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/select-button.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/skeleton.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/slider.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/speed-dial.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/split-button.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/splitter.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/stepper.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/tabs.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/tag.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/terminal.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/timeline.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/toast.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/toggle-switch.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/tree-select.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/cascadeselect.ts",
"c:/Users/PC123/Source/SoftMax.LaughTale/SoftMax.LaughTale.Client/src/components/camera.ts"
];

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.log(`Skipping ${file} - does not exist`);
        continue;
    }
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if already has dark mode
    if (content.includes('[data-theme="dark"]')) {
        console.log(`Skipping ${path.basename(file)} - already has dark mode`);
        continue;
    }

    const componentName = path.basename(file, '.ts');
    
    // Extract classes to target them with dark mode
    const classRegex = /class(?:Name)?=["']([^"']+)["']/g;
    let match;
    const classes = new Set();
    while ((match = classRegex.exec(content)) !== null) {
        const classNames = match[1].split(' ').map(c => c.trim()).filter(c => c && !c.includes('${') && !c.includes(' '));
        classNames.forEach(c => classes.add(c));
    }
    
    let cssRules = [];
    
    // General rule for the container if it doesn't match specific classes
    const uniqueClasses = Array.from(classes);
    const targetClasses = uniqueClasses.filter(c => c.includes(componentName) || c.includes('btn') || c.includes('item') || c.includes('header') || c.includes('content') || c.includes('overlay') || c.includes('wrap') || c.includes('input') || c.includes('panel') || c.includes('dialog') || c.includes('box') || c.includes('tab') || c.includes('list') || c.includes('menu'));
    
    if (targetClasses.length > 0) {
        targetClasses.forEach(c => {
            cssRules.push(`
[data-theme="dark"] .${c} {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}`);
        });
    } else {
        cssRules.push(`
[data-theme="dark"] .laughtale-${componentName} {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}`);
    }

    const addedCSS = cssRules.join('');

    if (content.includes('injectIslandStyle(')) {
        // Append to existing CSS
        // Usually there is a `const CSS = \`...\`;`
        // We can just replace \`; with the new rules + \`;
        // Find the end of the CSS string
        content = content.replace(/const CSS = `([\s\S]*?)`;/, (match, p1) => {
            return `const CSS = \`${p1}\n${addedCSS}\`;`;
        });
        
    } else {
        // Add injectIslandStyle and CSS
        let importStatement = `import { injectIslandStyle } from '../runtime/styles';\n`;
        if (!content.includes('injectIslandStyle')) {
            // Find last import
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLastImport = content.indexOf('\\n', lastImportIndex);
                // Actually let's just put it after the first import or at top
                content = content.replace(/(import .*?;?\n)/, `$1${importStatement}`);
            } else {
                content = importStatement + content;
            }
        }
        
        const cssBlock = `\nconst CSS = \`${addedCSS}\n\`;\n`;
        
        // Insert CSS before export default function
        content = content.replace(/export default function/, `${cssBlock}\nexport default function`);
        
        // Insert injectIslandStyle inside export default function
        content = content.replace(/(export default function[^{]*{\n)/, `$1    injectIslandStyle('${componentName}', CSS);\n`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${path.basename(file)}`);
}
