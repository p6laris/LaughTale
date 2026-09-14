#!/usr/bin/env node

// LaughTale CLI entry point (published as the "laughtale" npm bin).
//
// Usage:
//   laughtale islands discover --islands-dir <path> --out-dir <path>
//   laughtale islands bundle   --out-dir <path> --project-root <path> [--mode development|production]
//   laughtale islands build    --islands-dir <path> --project-root <path> --out-dir <path> [--mode development|production]
//
// `build` is just `discover` followed by `bundle` against the same --out-dir.
// Argument parsing is intentionally simple (hand-rolled --flag value pairs) —
// no CLI-args library is a dependency of this package.

import path from 'node:path';
import { runDiscover } from '../scripts/islands/discover.mjs';
import { runBundle } from '../scripts/islands/bundle.mjs';

const USAGE = `Usage:
  laughtale islands discover --islands-dir <path> --out-dir <path>
  laughtale islands bundle   --out-dir <path> --project-root <path> [--mode development|production]
  laughtale islands build    --islands-dir <path> --project-root <path> --out-dir <path> [--mode development|production]`;

function parseFlags(argv) {
    const flags = {};
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (!arg.startsWith('--')) {
            throw new Error(`Unexpected argument "${arg}". ${USAGE}`);
        }
        const key = arg.slice(2);
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('--')) {
            flags[key] = next;
            i++;
        } else {
            flags[key] = true;
        }
    }
    return flags;
}

function requireFlag(flags, name, command) {
    const value = flags[name];
    if (value === undefined || value === true) {
        throw new Error(`Missing required argument --${name} for "laughtale islands ${command}".\n${USAGE}`);
    }
    return value;
}

function resolveMode(flags) {
    const mode = flags.mode ?? 'development';
    if (mode !== 'development' && mode !== 'production') {
        throw new Error(`Invalid --mode "${mode}". Expected "development" or "production".`);
    }
    return mode;
}

async function main() {
    const [, , group, command, ...rest] = process.argv;

    if (group !== 'islands') {
        throw new Error(`Unknown command "${group ?? ''}".\n${USAGE}`);
    }

    const flags = parseFlags(rest);

    switch (command) {
        case 'discover': {
            const islandsDir = path.resolve(requireFlag(flags, 'islands-dir', 'discover'));
            const outDir = path.resolve(requireFlag(flags, 'out-dir', 'discover'));
            const { manifest } = runDiscover({ islandsDir, outDir });
            console.log(`[laughtale] Discovered ${manifest.islands.length} island(s). Wrote manifest and registry to ${outDir}.`);
            break;
        }

        case 'bundle': {
            const outDir = path.resolve(requireFlag(flags, 'out-dir', 'bundle'));
            const projectRoot = path.resolve(requireFlag(flags, 'project-root', 'bundle'));
            const mode = resolveMode(flags);
            const manifest = await runBundle({ islandsOutDir: outDir, projectRoot, mode });
            console.log(`[laughtale] Bundled ${manifest.islands.length} island(s) in ${mode} mode.`);
            break;
        }

        case 'build': {
            const islandsDir = path.resolve(requireFlag(flags, 'islands-dir', 'build'));
            const projectRoot = path.resolve(requireFlag(flags, 'project-root', 'build'));
            const outDir = path.resolve(requireFlag(flags, 'out-dir', 'build'));
            const mode = resolveMode(flags);

            const { manifest: discovered } = runDiscover({ islandsDir, outDir });
            console.log(`[laughtale] Discovered ${discovered.islands.length} island(s).`);

            const bundled = await runBundle({ islandsOutDir: outDir, projectRoot, mode });
            console.log(`[laughtale] Bundled ${bundled.islands.length} island(s) in ${mode} mode. Manifest ready at ${path.join(outDir, 'islands.manifest.g.json')}.`);
            break;
        }

        default:
            throw new Error(`Unknown "islands" subcommand "${command ?? ''}".\n${USAGE}`);
    }
}

main().catch((err) => {
    process.stderr.write(`[laughtale] ${err instanceof Error ? err.message : String(err)}\n`);
    process.exitCode = 1;
});
