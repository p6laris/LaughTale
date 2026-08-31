import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../src/components');
const outputReport = path.resolve(__dirname, '../docs/api-consistency-report.md');

console.log('[LaughTale API Audit] Scanning component props interfaces for naming consistency...');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

// Standard canonical prop naming dictionary:
const CANONICAL_CONVENTIONS = {
    // Data collections
    collections: 'data',          // canonical name for list/table dataset collections (alias: value)
    options: 'options',           // canonical name for selectable choice items (alias: items)
    
    // State booleans
    disabled: 'disabled',         // canonical (not isDisabled or disabledState)
    readonly: 'readonly',         // canonical (not isReadonly)
    visible: 'visible',           // canonical (not isOpen or show)
    loading: 'loading',           // canonical (not isLoading)
    multiple: 'multiple',         // canonical (not isMultiple)
    
    // Appearance & behavior
    size: 'size',                 // canonical (not variantSize)
    severity: 'severity',         // canonical (not variant/intent for status indicators)
    placeholder: 'placeholder',   // canonical (not hint)
    closable: 'closable'          // canonical (not dismissable)
};

const synonymGroups = [
    { canonical: 'data', synonyms: ['value', 'dataset', 'rows'], description: 'Primary tabular/data-bound collection' },
    { canonical: 'options', synonyms: ['items', 'choices', 'elements'], description: 'Selectable options array' },
    { canonical: 'disabled', synonyms: ['isDisabled', 'disabledState'], description: 'Disabled interactive state' },
    { canonical: 'readonly', synonyms: ['isReadonly', 'readOnlyState'], description: 'Readonly state' },
    { canonical: 'visible', synonyms: ['isOpen', 'shown', 'showModal'], description: 'Visibility toggle' },
    { canonical: 'loading', synonyms: ['isLoading', 'busy'], description: 'Loading indicator state' },
    { canonical: 'closable', synonyms: ['dismissable', 'isClosable', 'canClose'], description: 'Dismissable / closable' },
    { canonical: 'severity', synonyms: ['variant', 'intent', 'level'], description: 'Visual status theme' }
];

const componentApis = [];
let totalPropsFound = 0;
let aliasesNormalized = 0;

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const componentName = file.replace('.ts', '');

    // Extract interface props block
    const interfaceMatch = content.match(/export\s+interface\s+\w+Props\s*(?:extends[^{]+)?\{([^}]+)\}/s);
    if (!interfaceMatch) continue;

    const propLines = interfaceMatch[1].split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'));

    const props = [];
    for (const line of propLines) {
        const propMatch = line.match(/^(\w+)\s*\??\s*:\s*([^;]+);?/);
        if (propMatch) {
            const propName = propMatch[1];
            const propType = propMatch[2].trim();
            props.push({ name: propName, type: propType });
            totalPropsFound++;
        }
    }

    // Check against synonym dictionary
    const synonymWarnings = [];
    for (const group of synonymGroups) {
        const hasCanonical = props.some(p => p.name === group.canonical);
        for (const syn of group.synonyms) {
            const hasSyn = props.some(p => p.name === syn);
            if (hasSyn) {
                synonymWarnings.push({
                    synonym: syn,
                    canonical: group.canonical,
                    description: group.description,
                    isCoexisting: hasCanonical
                });
                aliasesNormalized++;
            }
        }
    }

    componentApis.push({
        component: componentName,
        props,
        warnings: synonymWarnings
    });
}

// Generate Markdown report
let md = `# LaughTale Component API Consistency Audit\n\n`;
md += `**Total Components Scanned:** ${files.length}\n`;
md += `**Total Prop Declarations:** ${totalPropsFound}\n`;
md += `**Aliased/Synonym Normalizations:** ${aliasesNormalized}\n\n`;

md += `## Canonical Property Conventions\n\n`;
md += `| Canonical Prop | Aliased Synonyms | Purpose |\n`;
md += `| :--- | :--- | :--- |\n`;
for (const g of synonymGroups) {
    md += `| \`${g.canonical}\` | ${g.synonyms.map(s => `\`${s}\``).join(', ')} | ${g.description} |\n`;
}

md += `\n## Component Breakdown\n\n`;
for (const item of componentApis) {
    md += `### \`${item.component}\` (${item.props.length} props)\n`;
    if (item.warnings.length > 0) {
        md += `> **Synonym Aliases:**\n`;
        for (const w of item.warnings) {
            md += `> - Uses \`${w.synonym}\` (canonical: \`${w.canonical}\`)${w.isCoexisting ? ' *(supports both via alias fallback)*' : ''}\n`;
        }
        md += `\n`;
    }
    md += `| Prop Name | Type |\n| :--- | :--- |\n`;
    for (const p of item.props) {
        md += `| \`${p.name}\` | \`${p.type.replace(/\|/g, '\\|')}\` |\n`;
    }
    md += `\n`;
}

fs.mkdirSync(path.dirname(outputReport), { recursive: true });
fs.writeFileSync(outputReport, md, 'utf-8');

console.log(`✅ [LaughTale API Audit] Audit completed across ${files.length} components.`);
console.log(`📄 Report written to: ${outputReport}\n`);
