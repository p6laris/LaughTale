---
title: "Vanilla TypeScript Islands Adapter"
description: "Zero-dependency raw DOM manipulation and micro-widgets using native Web APIs, standard custom events, and minimal JavaScript overhead."
order: 6
section: "Multi-Framework Adapters"
---

# Vanilla TypeScript Islands Adapter

LaughTale provides native support for **pure Vanilla TypeScript / JavaScript** islands via `createVanillaIsland`.

Vanilla islands require **zero third-party dependencies or virtual DOM runtimes**, making them ideal for high-speed widgets, modal triggers, audio players, copy buttons, and camera/canvas streams.

---

## ⚡ Step 1: Author Your Vanilla TypeScript Component

Create your component file (e.g. `src/islands/copy-terminal.ts`):

```typescript
import { IslandContext, emitIslandEvent } from 'laughtale';

interface TerminalProps {
    promptSymbol?: string;
    initialCommand: string;
    outputLines: string[];
}

export default function CopyTerminal(
    container: HTMLElement, 
    props: TerminalProps, 
    ctx?: IslandContext
) {
    const symbol = props.promptSymbol || '$';
    
    container.innerHTML = `
        <div class="terminal-box bg-surface-950 text-emerald-400 p-4 rounded-xl font-mono text-xs shadow-lg border border-surface-800">
            <div class="flex justify-between items-center pb-2 border-b border-surface-800 mb-2">
                <span class="text-surface-400 font-sans text-xs">Terminal</span>
                <button type="button" class="copy-btn bg-surface-800 text-surface-200 px-2 py-1 rounded text-xs hover:bg-surface-700">
                    Copy Command
                </button>
            </div>
            <div class="command-line flex items-center gap-2 mb-2 text-white">
                <span class="text-emerald-500 font-bold">${symbol}</span>
                <span class="cmd-text">${props.initialCommand}</span>
            </div>
            <div class="output-lines text-surface-400 space-y-1">
                ${props.outputLines.map(line => `<div>${line}</div>`).join('')}
            </div>
        </div>
    `;

    const copyBtn = container.querySelector('.copy-btn') as HTMLButtonElement;
    
    // Wire event listener passing ctx?.signal for auto-cleanup
    copyBtn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(props.initialCommand);
        copyBtn.innerText = 'Copied!';
        copyBtn.classList.add('text-emerald-400');
        
        emitIslandEvent('terminal:command-copied', { command: props.initialCommand });
        
        setTimeout(() => {
            copyBtn.innerText = 'Copy Command';
            copyBtn.classList.remove('text-emerald-400');
        }, 2000);
    }, { signal: ctx?.signal });

    // Optional unmount hook
    return () => {
        console.log(`[CopyTerminal] Cleaned up island '${ctx?.name}'`);
    };
}
```

---

## 🏗️ Step 2: Render in Razor (`.cshtml`)

```razor
@page
@model TerminalPageModel
@{
    ViewData["Title"] = "Vanilla TypeScript Island";
}

<div class="container py-4">
    <h2>Interactive CLI Box</h2>
    
    <island name="copy-terminal" 
            framework="Vanilla" 
            props="@(new { 
                PromptSymbol = ">", 
                InitialCommand = "dotnet new laughtale-web -n ProductionApp", 
                OutputLines = new[] { 
                    "Restoring .NET 10 packages...", 
                    "Generating Roslyn island contracts...", 
                    "Build succeeded in 0.45s." 
                } 
            })" 
            hydrate="Load" />
</div>
```

---

## 🛡️ Advantages of Vanilla Islands

1. **Zero Runtime Overhead**: 0 KB virtual DOM cost; purely raw DOM manipulations.
2. **Instant Hydration**: Executes synchronously without framework setup or state reconcile cycles.
3. **Web API Direct Access**: Perfect for WebRTC cameras (`navigator.mediaDevices`), Canvas 2D/WebGL, Audio Context, and IntersectionObservers.
