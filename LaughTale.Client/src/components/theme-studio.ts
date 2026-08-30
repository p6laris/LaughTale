import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: TweakAura Live Theme Studio (tweakcn-inspired)
 * Interactive theme customizer with real-time CSS variable injection, palette presets, radius sliders, and 1-click export.
 */

import { LucideIcons } from '../icons/lucide';
import { useDisclosure } from '../composables/useDisclosure';
import { useScrollLock } from '../composables/useScrollLock';
import { useClipboard } from '../composables/useClipboard';
import { AURA_PALETTES, generatePaletteRamp, updateToken, saveTheme, loadSavedTheme, generateThemeExports, checkWcagCompliance } from '../styles/design-tokens';

export interface ThemeStudioProps {
    defaultOpen?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

interface ColorPreset {
    name: string;
    hex: string;
    ramp: Record<string, string>;
}

const PRIMARY_PRESETS: Record<string, ColorPreset> = Object.entries(AURA_PALETTES).reduce((acc, [key, ramp]) => {
    acc[key] = {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        hex: ramp['500'] || '#10b981',
        ramp
    };
    return acc;
}, {} as Record<string, ColorPreset>);

interface NeutralPreset {
    name: string;
    s0: string;
    s50: string;
    s100: string;
    s200: string;
    s300: string;
    s400: string;
    s500: string;
    s600: string;
    s700: string;
    s800: string;
    s900: string;
    s950: string;
}

const NEUTRAL_PRESETS: Record<string, NeutralPreset> = {
    slate: {
        name: 'Slate',
        s0: '#ffffff', s50: '#f8fafc', s100: '#f1f5f9', s200: '#e2e8f0', s300: '#cbd5e1',
        s400: '#94a3b8', s500: '#64748b', s600: '#475569', s700: '#334155', s800: '#1e293b', s900: '#0f172a', s950: '#020617'
    },
    zinc: {
        name: 'Zinc',
        s0: '#ffffff', s50: '#fafafa', s100: '#f4f4f5', s200: '#e4e4e7', s300: '#d4d4d8',
        s400: '#a1a1aa', s500: '#71717a', s600: '#52525b', s700: '#3f3f46', s800: '#27272a', s900: '#18181b', s950: '#09090b'
    },
    stone: {
        name: 'Stone',
        s0: '#ffffff', s50: '#fafaf9', s100: '#f5f5f4', s200: '#e7e5e4', s300: '#d6d3d1',
        s400: '#a8a29e', s500: '#78716c', s600: '#57534e', s700: '#44403c', s800: '#292524', s900: '#1c1917', s950: '#0c0a09'
    },
    neutral: {
        name: 'Neutral',
        s0: '#ffffff', s50: '#fafafa', s100: '#f5f5f5', s200: '#e5e5e5', s300: '#d4d4d4',
        s400: '#a3a3a3', s500: '#737373', s600: '#525252', s700: '#404040', s800: '#262626', s900: '#171717', s950: '#0a0a0a'
    },
    gray: {
        name: 'Gray',
        s0: '#ffffff', s50: '#f9fafb', s100: '#f3f4f6', s200: '#e5e7eb', s300: '#d1d5db',
        s400: '#9ca3af', s500: '#6b7280', s600: '#4b5563', s700: '#374151', s800: '#1f2937', s900: '#111827', s950: '#030712'
    }
};

export default function ThemeStudioIsland(container: HTMLElement, props: ThemeStudioProps = {}, ctx?: IslandContext) {
    let currentPrimary = 'emerald';
    let currentCustomHex = '';
    let currentNeutral = 'slate';
    let currentRadius = '0.5rem';
    let currentDensity = 'normal';
    let currentShadow = 'layered';
    let currentFont = 'sans';
    let currentThemeMode = 'system';

    const disclosure = useDisclosure({ defaultIsOpen: props.defaultOpen });
    const scrollLock = useScrollLock();
    const clipboard = useClipboard();

    container.innerHTML = `
        <div class="laughtale-theme-studio-root">
            <button type="button" 
                    class="theme-studio-toggle-btn" 
                    title="Open Aura Live Theme Studio"
                    style="position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 5000; width: 3.25rem; height: 3.25rem; border-radius: 9999px; background: var(--lt-surface-900); color: var(--lt-surface-0); border: 2px solid var(--lt-primary-500); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; outline: none;">
                ${LucideIcons.palette}
            </button>
            <div class="theme-studio-backdrop" style="display: none; position: fixed; inset: 0; z-index: 5001; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);"></div>
            <div class="theme-studio-drawer" style="position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 440px; z-index: 5002; background: var(--lt-surface-0); border-left: 1px solid var(--lt-surface-200); box-shadow: -10px 0 35px -5px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--lt-surface-200);">
                    <div style="display: flex; align-items: center; gap: 0.625rem;">
                        <span style="color: var(--lt-primary-600); display: flex;">${LucideIcons.sliders || '🎨'}</span>
                        <div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: var(--lt-surface-900);">Aura Theme Studio</div>
                            <div style="font-size: 0.75rem; color: var(--lt-surface-500);">Live Reactive Design System Editor</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="studio-reset-btn" title="Reset to Defaults" style="border: none; background: transparent; color: var(--lt-surface-400); cursor: pointer; padding: 0.25rem; font-size: 0.75rem; border-radius: 4px;">
                            Reset
                        </button>
                        <button type="button" class="theme-studio-close-btn" style="border: none; background: transparent; color: var(--lt-surface-400); cursor: pointer; padding: 0.25rem; display: flex; border-radius: 4px;">
                            ${LucideIcons.x}
                        </button>
                    </div>
                </div>
                <div style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">Appearance Mode</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            <button type="button" class="mode-btn active" data-mode="light" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                ${LucideIcons.sun || '☀️'} Light
                            </button>
                            <button type="button" class="mode-btn" data-mode="dark" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                ${LucideIcons.moon || '🌙'} Dark
                            </button>
                            <button type="button" class="mode-btn" data-mode="system" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                System
                            </button>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Primary Palette</span>
                            <span class="studio-primary-label" style="font-size: 0.75rem; color: var(--lt-primary-600); font-weight: 700;">Emerald</span>
                        </div>
                        <div class="studio-color-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(2.1rem, 1fr)); gap: 0.4rem; margin-bottom: 0.75rem;"></div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--lt-surface-50); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); padding: 0.35rem 0.6rem;">
                            <input type="color" class="studio-custom-color-input" value="var(--lt-primary-500, #10b981)" style="width: 1.75rem; height: 1.75rem; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
                            <span style="font-size: 0.75rem; font-family: monospace; color: var(--lt-surface-600);">Custom Hex Accent</span>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">Neutral Surface Base</div>
                        <div class="studio-neutral-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.35rem;"></div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Corner Radius</span>
                            <span class="studio-radius-label" style="font-family: monospace; font-size: 0.75rem; color: var(--lt-primary-600); font-weight: 600;">0.5rem</span>
                        </div>
                        <div class="studio-radius-presets" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.25rem;">
                            <button type="button" class="radius-btn" data-radius="0rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">0</button>
                            <button type="button" class="radius-btn" data-radius="0.25rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">.25</button>
                            <button type="button" class="radius-btn" data-radius="0.375rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">.37</button>
                            <button type="button" class="radius-btn active" data-radius="0.5rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 2px solid var(--lt-primary-500); background: var(--lt-primary-50); color: var(--lt-primary-700); font-weight: bold; border-radius: 2px; cursor: pointer;">.5</button>
                            <button type="button" class="radius-btn" data-radius="0.75rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">.75</button>
                            <button type="button" class="radius-btn" data-radius="1.0rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">1.0</button>
                            <button type="button" class="radius-btn" data-radius="1.5rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">1.5</button>
                            <button type="button" class="radius-btn" data-radius="9999px" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); border-radius: 2px; cursor: pointer;">Pill</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Component Density</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            <button type="button" class="density-btn" data-density="compact" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">Compact</button>
                            <button type="button" class="density-btn active" data-density="normal" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 2px solid var(--lt-primary-500); border-radius: var(--lt-radius); background: var(--lt-primary-50); color: var(--lt-primary-700); font-weight: 600; cursor: pointer;">Normal</button>
                            <button type="button" class="density-btn" data-density="spacious" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">Spacious</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Shadow Elevation</div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem;">
                            <button type="button" class="shadow-btn" data-shadow="none" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">Flat</button>
                            <button type="button" class="shadow-btn" data-shadow="subtle" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">Subtle</button>
                            <button type="button" class="shadow-btn active" data-shadow="layered" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 2px solid var(--lt-primary-500); border-radius: var(--lt-radius); background: var(--lt-primary-50); color: var(--lt-primary-700); font-weight: 600; cursor: pointer;">Layered</button>
                            <button type="button" class="shadow-btn" data-shadow="bold" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">3D Bold</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Font Family</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.35rem;">
                            <button type="button" class="font-btn active" data-font="sans" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; border: 2px solid var(--lt-primary-500); border-radius: var(--lt-radius); background: var(--lt-primary-50); color: var(--lt-primary-700); font-weight: 600; cursor: pointer;">Jakarta</button>
                            <button type="button" class="font-btn" data-font="inter" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">Inter</button>
                            <button type="button" class="font-btn" data-font="mono" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer;">Mono</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--lt-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Preset Curated Themes</div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 240px; overflow-y: auto;">
                            <button type="button" class="preset-theme-btn" data-theme="emerald-zero-trust" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #10b981;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Emerald Zero-Trust</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Default</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="krd-golden" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #eab308;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">KRD Golden</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="supabase-violet" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #8b5cf6;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Supabase Violet</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.375</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sunset-ember" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #f43f5e;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Sunset Ember</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.75</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="ocean-blue" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #3b82f6;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Ocean Blue</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="cyber-cyan" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #06b6d4;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Cyberpunk Cyan</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.0</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="lime-minimal" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #84cc16;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Lime Minimal</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.25</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sunset-orange" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #f97316;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Sunset Orange</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sakura-pink" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #ec4899;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-800);">Sakura Pink</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--lt-surface-400);">Radius 1.0</span>
                            </button>
                        </div>
                    </div>
                    <div style="background: var(--lt-surface-50); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); padding: 1rem;">
                        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--lt-surface-400); text-transform: uppercase; margin-bottom: 0.75rem;">Interactive Live Preview</div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button type="button" class="p-button p-button-primary" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.75rem;">Primary</button>
                                <button type="button" class="p-button p-button-secondary" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.75rem;">Secondary</button>
                            </div>
                            <input type="text" value="Interactive Input" class="p-input" style="width: 100%; padding: 0.4rem 0.6rem; font-size: 0.75rem; border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); background: var(--lt-surface-0); color: var(--lt-text-primary);" />
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem;">
                                <span class="aura-tag tag-emerald">Active Badge</span>
                                <span style="color: var(--lt-primary-600); font-weight: bold;">75% Telemetry</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--lt-surface-200); background: var(--lt-surface-50); display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="studio-copy-css-btn p-button p-button-primary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.copy} Copy CSS Custom Properties
                    </button>
                    <button type="button" class="studio-copy-csharp-btn p-button p-button-secondary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.code} Copy C# Theme Tokens
                    </button>
                </div>
            </div>
        </div>
    `;

    const toggleBtn = container.querySelector<HTMLButtonElement>('.theme-studio-toggle-btn')!;
    const backdrop = container.querySelector<HTMLElement>('.theme-studio-backdrop')!;
    const drawer = container.querySelector<HTMLElement>('.theme-studio-drawer')!;
    const closeBtn = container.querySelector<HTMLButtonElement>('.theme-studio-close-btn')!;
    const resetBtn = container.querySelector<HTMLButtonElement>('.studio-reset-btn')!;
    const colorGrid = container.querySelector<HTMLElement>('.studio-color-grid')!;
    const neutralGrid = container.querySelector<HTMLElement>('.studio-neutral-grid')!;
    const radiusLabel = container.querySelector<HTMLElement>('.studio-radius-label')!;
    const primaryLabel = container.querySelector<HTMLElement>('.studio-primary-label')!;
    const customColorInput = container.querySelector<HTMLInputElement>('.studio-custom-color-input')!;
    const copyCssBtn = container.querySelector<HTMLButtonElement>('.studio-copy-css-btn')!;
    const copyCSharpBtn = container.querySelector<HTMLButtonElement>('.studio-copy-csharp-btn')!;

    colorGrid.innerHTML = Object.entries(PRIMARY_PRESETS).map(([key, p]) => `
        <button type="button" 
                class="studio-color-swatch ${key === currentPrimary ? 'active' : ''}" 
                data-color="${key}" 
                title="${p.name}" 
                style="width: 100%; aspect-ratio: 1; border-radius: var(--lt-radius); background: ${p.hex}; border: ${key === currentPrimary ? '2px solid var(--lt-surface-0, #ffffff)' : '1px solid rgba(0,0,0,0.1)'}; box-shadow: ${key === currentPrimary ? '0 0 0 2px var(--lt-surface-900)' : 'none'}; cursor: pointer; transition: transform 0.15s ease;">
        </button>
    `).join('');

    neutralGrid.innerHTML = Object.entries(NEUTRAL_PRESETS).map(([key, n]) => `
        <button type="button" 
                class="studio-neutral-swatch ${key === currentNeutral ? 'active' : ''}" 
                data-neutral="${key}" 
                style="padding: 0.35rem 0.25rem; font-size: 0.6875rem; font-weight: 600; border: ${key === currentNeutral ? '2px solid var(--lt-primary-500)' : '1px solid var(--lt-surface-200)'}; border-radius: var(--lt-radius); background: ${n.s100}; color: ${n.s900}; cursor: pointer; text-align: center;">
            ${n.name}
        </button>
    `).join('');

    function applyTheme() {
        let currentRamp: Record<string, string>;
        let primaryName: string;
        if (currentCustomHex) {
            currentRamp = generatePaletteRamp(currentCustomHex);
            primaryName = `Custom (${currentCustomHex})`;
        } else {
            const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
            currentRamp = p.ramp;
            primaryName = p.name;
        }

        const contrast = checkWcagCompliance(currentRamp['500'] || 'var(--lt-primary-500, #10b981)', 'var(--lt-surface-0, #ffffff)');
        if (primaryLabel) {
            primaryLabel.textContent = `${primaryName} • ${contrast.formattedRatio} (${contrast.grade})`;
        }

        for (const [shade, hex] of Object.entries(currentRamp)) {
            updateToken(`--lt-primary-${shade}`, hex);
            updateToken(`--p-primary-${shade}`, hex);
        }
        updateToken('--lt-primary-color', currentRamp['500'] || '#10b981');
        updateToken('--p-primary-color', currentRamp['500'] || '#10b981');

        const n = NEUTRAL_PRESETS[currentNeutral] || NEUTRAL_PRESETS.slate;
        updateToken('--lt-surface-0', n.s0);
        updateToken('--lt-surface-50', n.s50);
        updateToken('--lt-surface-100', n.s100);
        updateToken('--lt-surface-200', n.s200);
        updateToken('--lt-surface-300', n.s300);
        updateToken('--lt-surface-400', n.s400);
        updateToken('--lt-surface-500', n.s500);
        updateToken('--lt-surface-600', n.s600);
        updateToken('--lt-surface-700', n.s700);
        updateToken('--lt-surface-800', n.s800);
        updateToken('--lt-surface-900', n.s900);
        updateToken('--lt-surface-950', n.s950);

        updateToken('--p-surface-0', n.s0);
        updateToken('--p-surface-50', n.s50);
        updateToken('--p-surface-100', n.s100);
        updateToken('--p-surface-200', n.s200);
        updateToken('--p-surface-300', n.s300);
        updateToken('--p-surface-400', n.s400);
        updateToken('--p-surface-500', n.s500);
        updateToken('--p-surface-600', n.s600);
        updateToken('--p-surface-700', n.s700);
        updateToken('--p-surface-800', n.s800);
        updateToken('--p-surface-900', n.s900);
        updateToken('--p-surface-950', n.s950);

        const root = typeof document !== 'undefined' ? document.documentElement : null;
        if (root) {
            root.style.setProperty('--lt-radius', currentRadius);
            root.style.setProperty('--lt-radius-md', currentRadius);
            root.style.setProperty('--p-border-radius', currentRadius);
            const radNum = parseFloat(currentRadius) || 0;
            const lgVal = currentRadius === '9999px' ? '9999px' : `${radNum * 1.5}rem`;
            const xlVal = currentRadius === '9999px' ? '9999px' : `${radNum * 2}rem`;
            root.style.setProperty('--lt-radius-lg', lgVal);
            root.style.setProperty('--lt-radius-xl', xlVal);
            root.style.setProperty('--p-border-radius-lg', lgVal);
            root.style.setProperty('--p-border-radius-xl', xlVal);
            if (radiusLabel) radiusLabel.textContent = currentRadius;

            if (currentDensity === 'compact') {
                root.style.setProperty('--lt-content-padding', '0.625rem');
                root.style.setProperty('--lt-field-padding-y', '0.35rem');
                root.style.setProperty('--lt-field-padding-x', '0.5rem');
                root.style.setProperty('--lt-button-padding-y', '0.35rem');
                root.style.setProperty('--lt-button-padding-x', '0.65rem');
                root.style.setProperty('--p-content-padding', '0.625rem');
                root.style.setProperty('--p-field-padding-y', '0.35rem');
                root.style.setProperty('--p-field-padding-x', '0.5rem');
                root.style.setProperty('--p-button-padding-y', '0.35rem');
                root.style.setProperty('--p-button-padding-x', '0.65rem');
            } else if (currentDensity === 'spacious') {
                root.style.setProperty('--lt-content-padding', '1.5rem');
                root.style.setProperty('--lt-field-padding-y', '0.65rem');
                root.style.setProperty('--lt-field-padding-x', '1rem');
                root.style.setProperty('--lt-button-padding-y', '0.65rem');
                root.style.setProperty('--lt-button-padding-x', '1.25rem');
                root.style.setProperty('--p-content-padding', '1.5rem');
                root.style.setProperty('--p-field-padding-y', '0.65rem');
                root.style.setProperty('--p-field-padding-x', '1rem');
                root.style.setProperty('--p-button-padding-y', '0.65rem');
                root.style.setProperty('--p-button-padding-x', '1.25rem');
            } else {
                root.style.setProperty('--lt-content-padding', '1rem');
                root.style.setProperty('--lt-field-padding-y', '0.5rem');
                root.style.setProperty('--lt-field-padding-x', '0.75rem');
                root.style.setProperty('--lt-button-padding-y', '0.5rem');
                root.style.setProperty('--lt-button-padding-x', '1rem');
                root.style.setProperty('--p-content-padding', '1rem');
                root.style.setProperty('--p-field-padding-y', '0.5rem');
                root.style.setProperty('--p-field-padding-x', '0.75rem');
                root.style.setProperty('--p-button-padding-y', '0.5rem');
                root.style.setProperty('--p-button-padding-x', '1rem');
            }

            if (currentShadow === 'none') {
                root.style.setProperty('--lt-shadow-sm', 'none');
                root.style.setProperty('--lt-shadow-md', 'none');
                root.style.setProperty('--lt-shadow-lg', 'none');
                root.style.setProperty('--lt-shadow-xl', 'none');
                root.style.setProperty('--p-shadow-sm', 'none');
                root.style.setProperty('--p-shadow-md', 'none');
                root.style.setProperty('--p-shadow-lg', 'none');
                root.style.setProperty('--p-shadow-xl', 'none');
            } else if (currentShadow === 'subtle') {
                const s1 = '0 1px 2px rgba(0,0,0,0.03)';
                const s2 = '0 2px 4px rgba(0,0,0,0.05)';
                const s3 = '0 4px 8px rgba(0,0,0,0.06)';
                const s4 = '0 8px 16px rgba(0,0,0,0.08)';
                root.style.setProperty('--lt-shadow-sm', s1);
                root.style.setProperty('--lt-shadow-md', s2);
                root.style.setProperty('--lt-shadow-lg', s3);
                root.style.setProperty('--lt-shadow-xl', s4);
                root.style.setProperty('--p-shadow-sm', s1);
                root.style.setProperty('--p-shadow-md', s2);
                root.style.setProperty('--p-shadow-lg', s3);
                root.style.setProperty('--p-shadow-xl', s4);
            } else if (currentShadow === 'bold') {
                const s1 = '0 2px 4px rgba(0,0,0,0.1)';
                const s2 = '0 8px 16px rgba(0,0,0,0.15)';
                const s3 = '0 16px 32px rgba(0,0,0,0.2)';
                const s4 = '0 24px 48px rgba(0,0,0,0.25)';
                root.style.setProperty('--lt-shadow-sm', s1);
                root.style.setProperty('--lt-shadow-md', s2);
                root.style.setProperty('--lt-shadow-lg', s3);
                root.style.setProperty('--lt-shadow-xl', s4);
                root.style.setProperty('--p-shadow-sm', s1);
                root.style.setProperty('--p-shadow-md', s2);
                root.style.setProperty('--p-shadow-lg', s3);
                root.style.setProperty('--p-shadow-xl', s4);
            } else {
                const s1 = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                const s2 = '0 4px 6px -1px rgba(0, 0, 0, 0.07)';
                const s3 = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                const s4 = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                root.style.setProperty('--lt-shadow-sm', s1);
                root.style.setProperty('--lt-shadow-md', s2);
                root.style.setProperty('--lt-shadow-lg', s3);
                root.style.setProperty('--lt-shadow-xl', s4);
                root.style.setProperty('--p-shadow-sm', s1);
                root.style.setProperty('--p-shadow-md', s2);
                root.style.setProperty('--p-shadow-lg', s3);
                root.style.setProperty('--p-shadow-xl', s4);
            }

            let fontVal = 'Plus Jakarta Sans, sans-serif';
            if (currentFont === 'inter') {
                fontVal = 'Inter, -apple-system, sans-serif';
            } else if (currentFont === 'mono') {
                fontVal = 'JetBrains Mono, monospace';
            }
            root.style.setProperty('--lt-font-family', fontVal);
            root.style.setProperty('--p-font-family', fontVal);

            if (currentThemeMode === 'dark') {
                root.classList.add('dark');
                root.setAttribute('data-theme', 'dark');
            } else if (currentThemeMode === 'light') {
                root.classList.remove('dark');
                root.setAttribute('data-theme', 'light');
            } else {
                const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.toggle('dark', isSysDark);
                root.setAttribute('data-theme', isSysDark ? 'dark' : 'light');
            }
        }

        saveTheme({
            primary: currentCustomHex || currentPrimary,
            neutral: currentNeutral,
            radius: currentRadius,
            density: currentDensity,
            shadow: currentShadow,
            font: currentFont,
            darkMode: currentThemeMode === 'dark'
        });
    }

    function open() {
        disclosure.open();
        backdrop.style.display = 'block';
        drawer.style.transform = 'translateX(0)';
        scrollLock.lock();
    }

    function close() {
        disclosure.close();
        drawer.style.transform = 'translateX(100%)';
        setTimeout(() => {
            backdrop.style.display = 'none';
        }, 250);
        scrollLock.unlock();
    }

    toggleBtn.addEventListener('click', () => {
        if (disclosure.isOpen) close();
        else open();
    });

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    container.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentThemeMode = btn.getAttribute('data-mode') || 'system';
            container.querySelectorAll('.mode-btn').forEach(b => {
                b.classList.remove('active');
                (b as HTMLElement).style.borderColor = 'var(--lt-surface-200)';
                (b as HTMLElement).style.background = 'var(--lt-surface-50)';
            });
            btn.classList.add('active');
            (btn as HTMLElement).style.borderColor = 'var(--lt-primary-500)';
            (btn as HTMLElement).style.background = 'var(--lt-primary-50)';
            applyTheme();
        });
    });

    colorGrid.querySelectorAll('.studio-color-swatch').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCustomHex = '';
            currentPrimary = btn.getAttribute('data-color')!;
            colorGrid.querySelectorAll('.studio-color-swatch').forEach(b => {
                const k = b.getAttribute('data-color');
                (b as HTMLElement).style.boxShadow = k === currentPrimary ? '0 0 0 2px var(--lt-surface-900)' : 'none';
            });
            applyTheme();
        });
    });

    if (customColorInput) {
        customColorInput.addEventListener('input', () => {
            currentCustomHex = customColorInput.value;
            applyTheme();
        });
    }

    neutralGrid.querySelectorAll('.studio-neutral-swatch').forEach(btn => {
        btn.addEventListener('click', () => {
            currentNeutral = btn.getAttribute('data-neutral')!;
            neutralGrid.querySelectorAll('.studio-neutral-swatch').forEach(b => {
                const k = b.getAttribute('data-neutral');
                (b as HTMLElement).style.border = k === currentNeutral ? '2px solid var(--lt-primary-500)' : '1px solid var(--lt-surface-200)';
            });
            applyTheme();
        });
    });

    container.querySelectorAll('.radius-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentRadius = btn.getAttribute('data-radius')!;
            container.querySelectorAll('.radius-btn').forEach(b => {
                b.classList.remove('active');
                (b as HTMLElement).style.borderColor = 'var(--lt-surface-200)';
                (b as HTMLElement).style.background = 'var(--lt-surface-50)';
                (b as HTMLElement).style.color = 'inherit';
                (b as HTMLElement).style.fontWeight = 'normal';
            });
            btn.classList.add('active');
            (btn as HTMLElement).style.borderColor = 'var(--lt-primary-500)';
            (btn as HTMLElement).style.background = 'var(--lt-primary-50)';
            (btn as HTMLElement).style.color = 'var(--lt-primary-700)';
            (btn as HTMLElement).style.fontWeight = 'bold';
            applyTheme();
        });
    });

    container.querySelectorAll('.density-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentDensity = btn.getAttribute('data-density') || 'normal';
            container.querySelectorAll('.density-btn').forEach(b => {
                b.classList.remove('active');
                (b as HTMLElement).style.borderColor = 'var(--lt-surface-200)';
                (b as HTMLElement).style.background = 'var(--lt-surface-50)';
            });
            btn.classList.add('active');
            (btn as HTMLElement).style.borderColor = 'var(--lt-primary-500)';
            (btn as HTMLElement).style.background = 'var(--lt-primary-50)';
            applyTheme();
        });
    });

    container.querySelectorAll('.shadow-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentShadow = btn.getAttribute('data-shadow') || 'layered';
            container.querySelectorAll('.shadow-btn').forEach(b => {
                b.classList.remove('active');
                (b as HTMLElement).style.borderColor = 'var(--lt-surface-200)';
                (b as HTMLElement).style.background = 'var(--lt-surface-50)';
            });
            btn.classList.add('active');
            (btn as HTMLElement).style.borderColor = 'var(--lt-primary-500)';
            (btn as HTMLElement).style.background = 'var(--lt-primary-50)';
            applyTheme();
        });
    });

    container.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFont = btn.getAttribute('data-font') || 'sans';
            container.querySelectorAll('.font-btn').forEach(b => {
                b.classList.remove('active');
                (b as HTMLElement).style.borderColor = 'var(--lt-surface-200)';
                (b as HTMLElement).style.background = 'var(--lt-surface-50)';
            });
            btn.classList.add('active');
            (btn as HTMLElement).style.borderColor = 'var(--lt-primary-500)';
            (btn as HTMLElement).style.background = 'var(--lt-primary-50)';
            applyTheme();
        });
    });

    container.querySelectorAll('.preset-theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCustomHex = '';
            const theme = btn.getAttribute('data-theme');
            if (theme === 'emerald-zero-trust') {
                currentPrimary = 'emerald';
                currentNeutral = 'slate';
                currentRadius = '0.5rem';
                currentDensity = 'normal';
            } else if (theme === 'krd-golden') {
                currentPrimary = 'yellow';
                currentNeutral = 'zinc';
                currentRadius = '0.5rem';
                currentDensity = 'normal';
            } else if (theme === 'supabase-violet') {
                currentPrimary = 'violet';
                currentNeutral = 'zinc';
                currentRadius = '0.375rem';
                currentDensity = 'compact';
            } else if (theme === 'sunset-ember') {
                currentPrimary = 'rose';
                currentNeutral = 'stone';
                currentRadius = '0.75rem';
                currentDensity = 'normal';
            } else if (theme === 'ocean-blue') {
                currentPrimary = 'blue';
                currentNeutral = 'slate';
                currentRadius = '0.5rem';
                currentDensity = 'normal';
            } else if (theme === 'cyber-cyan') {
                currentPrimary = 'cyan';
                currentNeutral = 'zinc';
                currentRadius = '0rem';
                currentDensity = 'compact';
            } else if (theme === 'lime-minimal') {
                currentPrimary = 'lime';
                currentNeutral = 'neutral';
                currentRadius = '0.25rem';
                currentDensity = 'compact';
            } else if (theme === 'sunset-orange') {
                currentPrimary = 'orange';
                currentNeutral = 'stone';
                currentRadius = '0.5rem';
                currentDensity = 'normal';
            } else if (theme === 'sakura-pink') {
                currentPrimary = 'pink';
                currentNeutral = 'zinc';
                currentRadius = '1.0rem';
                currentDensity = 'spacious';
            }
            applyTheme();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentPrimary = 'emerald';
            currentCustomHex = '';
            currentNeutral = 'slate';
            currentRadius = '0.5rem';
            currentDensity = 'normal';
            currentShadow = 'layered';
            currentFont = 'sans';
            currentThemeMode = 'system';
            applyTheme();
        });
    }

    copyCssBtn.addEventListener('click', () => {
        const exports = generateThemeExports({
            primary: currentCustomHex || currentPrimary,
            neutral: currentNeutral,
            radius: currentRadius,
            darkMode: currentThemeMode === 'dark'
        });

        clipboard.copy(exports.css);
        copyCssBtn.innerHTML = `${LucideIcons.check} Copied to Clipboard!`;
        setTimeout(() => {
            copyCssBtn.innerHTML = `${LucideIcons.copy} Copy CSS Custom Properties`;
        }, 2000);
    });

    copyCSharpBtn.addEventListener('click', () => {
        const exports = generateThemeExports({
            primary: currentCustomHex || currentPrimary,
            neutral: currentNeutral,
            radius: currentRadius,
            darkMode: currentThemeMode === 'dark'
        });

        clipboard.copy(exports.csharp);
        copyCSharpBtn.innerHTML = `${LucideIcons.check} Copied C# Code!`;
        setTimeout(() => {
            copyCSharpBtn.innerHTML = `${LucideIcons.code} Copy C# Theme Tokens`;
        }, 2000);
    });

    document.addEventListener('studio:open', open, { signal: ctx?.signal });
    document.addEventListener('studio:export', () => {
        open();
        copyCssBtn.click();
    }, { signal: ctx?.signal });

    let isInspectorActive = false;
    let hoveredElement: HTMLElement | null = null;

    document.addEventListener('mouseover', (e) => {
        if (!isInspectorActive) return;
        const target = e.target as HTMLElement;
        const partEl = target?.closest<HTMLElement>('[data-part]');
        if (partEl && !container.contains(partEl)) {
            if (hoveredElement && hoveredElement !== partEl) {
                hoveredElement.style.outline = '';
            }
            hoveredElement = partEl;
            hoveredElement.style.outline = '2px dashed var(--lt-primary-500)';
        }
    }, { signal: ctx?.signal });

    document.addEventListener('mouseout', () => {
        if (!isInspectorActive) return;
        if (hoveredElement) {
            hoveredElement.style.outline = '';
            hoveredElement = null;
        }
    }, { signal: ctx?.signal });

    const saved = loadSavedTheme();
    if (saved) {
        if (saved.primary && saved.primary.startsWith('#')) {
            currentCustomHex = saved.primary;
        } else if (saved.primary) {
            currentPrimary = saved.primary;
        }
        if (saved.neutral) currentNeutral = saved.neutral;
        if (saved.radius) currentRadius = saved.radius;
        if (saved.density) currentDensity = saved.density;
        if (saved.shadow) currentShadow = saved.shadow;
        if (saved.font) currentFont = saved.font;
        if (typeof saved.darkMode === 'boolean') {
            currentThemeMode = saved.darkMode ? 'dark' : 'light';
        }

        // Sync mode buttons
        container.querySelectorAll('.mode-btn').forEach(b => {
            const m = b.getAttribute('data-mode');
            const isActive = m === (typeof saved.darkMode === 'boolean' ? (saved.darkMode ? 'dark' : 'light') : 'system');
            b.classList.toggle('active', isActive);
            (b as HTMLElement).style.borderColor = isActive ? 'var(--lt-primary-500)' : 'var(--lt-surface-200)';
            (b as HTMLElement).style.background = isActive ? 'var(--lt-primary-50)' : 'var(--lt-surface-50)';
        });

        // Sync radius buttons
        container.querySelectorAll('.radius-btn').forEach(b => {
            const r = b.getAttribute('data-radius');
            const isActive = r === currentRadius;
            b.classList.toggle('active', isActive);
            (b as HTMLElement).style.borderColor = isActive ? 'var(--lt-primary-500)' : 'var(--lt-surface-200)';
            (b as HTMLElement).style.background = isActive ? 'var(--lt-primary-50)' : 'var(--lt-surface-50)';
            (b as HTMLElement).style.color = isActive ? 'var(--lt-primary-700)' : 'inherit';
            (b as HTMLElement).style.fontWeight = isActive ? 'bold' : 'normal';
        });

        // Sync density buttons
        container.querySelectorAll('.density-btn').forEach(b => {
            const d = b.getAttribute('data-density');
            const isActive = d === currentDensity;
            b.classList.toggle('active', isActive);
            (b as HTMLElement).style.borderColor = isActive ? 'var(--lt-primary-500)' : 'var(--lt-surface-200)';
            (b as HTMLElement).style.background = isActive ? 'var(--lt-primary-50)' : 'var(--lt-surface-50)';
            (b as HTMLElement).style.color = isActive ? 'var(--lt-primary-700)' : 'inherit';
            (b as HTMLElement).style.fontWeight = isActive ? '600' : 'normal';
        });

        // Sync shadow buttons
        container.querySelectorAll('.shadow-btn').forEach(b => {
            const s = b.getAttribute('data-shadow');
            const isActive = s === currentShadow;
            b.classList.toggle('active', isActive);
            (b as HTMLElement).style.borderColor = isActive ? 'var(--lt-primary-500)' : 'var(--lt-surface-200)';
            (b as HTMLElement).style.background = isActive ? 'var(--lt-primary-50)' : 'var(--lt-surface-50)';
            (b as HTMLElement).style.color = isActive ? 'var(--lt-primary-700)' : 'inherit';
            (b as HTMLElement).style.fontWeight = isActive ? '600' : 'normal';
        });

        // Sync font buttons
        container.querySelectorAll('.font-btn').forEach(b => {
            const f = b.getAttribute('data-font');
            const isActive = f === currentFont;
            b.classList.toggle('active', isActive);
            (b as HTMLElement).style.borderColor = isActive ? 'var(--lt-primary-500)' : 'var(--lt-surface-200)';
            (b as HTMLElement).style.background = isActive ? 'var(--lt-primary-50)' : 'var(--lt-surface-50)';
            (b as HTMLElement).style.color = isActive ? 'var(--lt-primary-700)' : 'inherit';
            (b as HTMLElement).style.fontWeight = isActive ? '600' : 'normal';
        });
    }

    applyTheme();
}
