import {
  useClipboard
} from "./chunk-Y4YSQNFD.js";
import {
  useScrollLock
} from "./chunk-I7ZAYNYP.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-G3Y35IKD.js";

// ../SoftMax.LaughTale.Client/src/components/theme-studio.ts
var PRIMARY_PRESETS = {
  emerald: {
    name: "Emerald",
    hex: "#10b981",
    lightP50: "#ecfdf5",
    lightP100: "#d1fae5",
    lightP200: "#a7f3d0",
    lightP500: "#10b981",
    lightP600: "#059669",
    lightP700: "#047857",
    darkP50: "#064e3b",
    darkP100: "#065f46",
    darkP200: "#047857"
  },
  indigo: {
    name: "Indigo",
    hex: "#6366f1",
    lightP50: "#eef2ff",
    lightP100: "#e0e7ff",
    lightP200: "#c7d2fe",
    lightP500: "#6366f1",
    lightP600: "#4f46e5",
    lightP700: "#4338ca",
    darkP50: "#312e81",
    darkP100: "#3730a3",
    darkP200: "#4338ca"
  },
  violet: {
    name: "Violet",
    hex: "#8b5cf6",
    lightP50: "#f5f3ff",
    lightP100: "#ede9fe",
    lightP200: "#ddd6fe",
    lightP500: "#8b5cf6",
    lightP600: "#7c3aed",
    lightP700: "#6d28d9",
    darkP50: "#4c1d95",
    darkP100: "#5b21b6",
    darkP200: "#6d28d9"
  },
  rose: {
    name: "Rose",
    hex: "#f43f5e",
    lightP50: "#fff1f2",
    lightP100: "#ffe4e6",
    lightP200: "#fecdd3",
    lightP500: "#f43f5e",
    lightP600: "#e11d48",
    lightP700: "#be123c",
    darkP50: "#881337",
    darkP100: "#9f1239",
    darkP200: "#be123c"
  },
  amber: {
    name: "Amber",
    hex: "#f59e0b",
    lightP50: "#fffbeb",
    lightP100: "#fef3c7",
    lightP200: "#fde68a",
    lightP500: "#f59e0b",
    lightP600: "#d97706",
    lightP700: "#b45309",
    darkP50: "#78350f",
    darkP100: "#92400e",
    darkP200: "#b45309"
  },
  cyan: {
    name: "Cyan",
    hex: "#06b6d4",
    lightP50: "#ecfeff",
    lightP100: "#cffafe",
    lightP200: "#a5f3fc",
    lightP500: "#06b6d4",
    lightP600: "#0891b2",
    lightP700: "#0e7490",
    darkP50: "#164e63",
    darkP100: "#155e75",
    darkP200: "#0e7490"
  },
  yellow: {
    name: "KRD Yellow",
    hex: "#eab308",
    lightP50: "#fefce8",
    lightP100: "#fef9c3",
    lightP200: "#fef08a",
    lightP500: "#eab308",
    lightP600: "#ca8a04",
    lightP700: "#a16207",
    darkP50: "#713f12",
    darkP100: "#854d0e",
    darkP200: "#a16207"
  },
  blue: {
    name: "Blue",
    hex: "#3b82f6",
    lightP50: "#eff6ff",
    lightP100: "#dbeafe",
    lightP200: "#bfdbfe",
    lightP500: "#3b82f6",
    lightP600: "#2563eb",
    lightP700: "#1d4ed8",
    darkP50: "#1e3a5f",
    darkP100: "#1e40af",
    darkP200: "#1d4ed8"
  },
  lime: {
    name: "Lime",
    hex: "#84cc16",
    lightP50: "#f7fee7",
    lightP100: "#ecfccb",
    lightP200: "#d9f99d",
    lightP500: "#84cc16",
    lightP600: "#65a30d",
    lightP700: "#4d7c0f",
    darkP50: "#365314",
    darkP100: "#3f6212",
    darkP200: "#4d7c0f"
  },
  teal: {
    name: "Teal",
    hex: "#14b8a6",
    lightP50: "#f0fdfa",
    lightP100: "#ccfbf1",
    lightP200: "#99f6e4",
    lightP500: "#14b8a6",
    lightP600: "#0d9488",
    lightP700: "#0f766e",
    darkP50: "#134e4a",
    darkP100: "#115e59",
    darkP200: "#0f766e"
  },
  orange: {
    name: "Orange",
    hex: "#f97316",
    lightP50: "#fff7ed",
    lightP100: "#ffedd5",
    lightP200: "#fed7aa",
    lightP500: "#f97316",
    lightP600: "#ea580c",
    lightP700: "#c2410c",
    darkP50: "#7c2d12",
    darkP100: "#9a3412",
    darkP200: "#c2410c"
  },
  pink: {
    name: "Pink",
    hex: "#ec4899",
    lightP50: "#fdf2f8",
    lightP100: "#fce7f3",
    lightP200: "#fbcfe8",
    lightP500: "#ec4899",
    lightP600: "#db2777",
    lightP700: "#be185d",
    darkP50: "#831843",
    darkP100: "#9d174d",
    darkP200: "#be185d"
  },
  sky: {
    name: "Sky",
    hex: "#0ea5e9",
    lightP50: "#f0f9ff",
    lightP100: "#e0f2fe",
    lightP200: "#bae6fd",
    lightP500: "#0ea5e9",
    lightP600: "#0284c7",
    lightP700: "#0369a1",
    darkP50: "#0c4a6e",
    darkP100: "#075985",
    darkP200: "#0369a1"
  }
};
var NEUTRAL_PRESETS = {
  slate: {
    name: "Slate",
    s0: "#ffffff",
    s50: "#f8fafc",
    s100: "#f1f5f9",
    s200: "#e2e8f0",
    s300: "#cbd5e1",
    s400: "#94a3b8",
    s500: "#64748b",
    s600: "#475569",
    s700: "#334155",
    s800: "#1e293b",
    s900: "#0f172a",
    s950: "#020617"
  },
  zinc: {
    name: "Zinc",
    s0: "#ffffff",
    s50: "#fafafa",
    s100: "#f4f4f5",
    s200: "#e4e4e7",
    s300: "#d4d4d8",
    s400: "#a1a1aa",
    s500: "#71717a",
    s600: "#52525b",
    s700: "#3f3f46",
    s800: "#27272a",
    s900: "#18181b",
    s950: "#09090b"
  },
  stone: {
    name: "Stone",
    s0: "#ffffff",
    s50: "#fafaf9",
    s100: "#f5f5f4",
    s200: "#e7e5e4",
    s300: "#d6d3d1",
    s400: "#a8a29e",
    s500: "#78716c",
    s600: "#57534e",
    s700: "#44403c",
    s800: "#292524",
    s900: "#1c1917",
    s950: "#0c0a09"
  },
  neutral: {
    name: "Neutral",
    s0: "#ffffff",
    s50: "#fafafa",
    s100: "#f5f5f5",
    s200: "#e5e5e5",
    s300: "#d4d4d4",
    s400: "#a3a3a3",
    s500: "#737373",
    s600: "#525252",
    s700: "#404040",
    s800: "#262626",
    s900: "#171717",
    s950: "#0a0a0a"
  },
  gray: {
    name: "Gray",
    s0: "#ffffff",
    s50: "#f9fafb",
    s100: "#f3f4f6",
    s200: "#e5e7eb",
    s300: "#d1d5db",
    s400: "#9ca3af",
    s500: "#6b7280",
    s600: "#4b5563",
    s700: "#374151",
    s800: "#1f2937",
    s900: "#111827",
    s950: "#030712"
  }
};
function ThemeStudioIsland(container, props = {}) {
  let currentPrimary = "emerald";
  let currentCustomHex = "";
  let currentNeutral = "slate";
  let currentRadius = "0.5rem";
  let currentDensity = "normal";
  let currentShadow = "layered";
  let currentFont = "sans";
  let currentThemeMode = "system";
  const disclosure = useDisclosure({ defaultIsOpen: props.defaultOpen });
  const scrollLock = useScrollLock();
  const clipboard = useClipboard();
  container.innerHTML = `
        <div class="laughtale-theme-studio-root">
            <button type="button" 
                    class="theme-studio-toggle-btn" 
                    title="Open Aura Live Theme Studio"
                    style="position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 5000; width: 3.25rem; height: 3.25rem; border-radius: 9999px; background: var(--p-surface-900, #0f172a); color: var(--p-surface-0, #ffffff); border: 2px solid var(--p-primary-500, #10b981); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; outline: none;">
                ${LucideIcons.palette}
            </button>
            <div class="theme-studio-backdrop" style="display: none; position: fixed; inset: 0; z-index: 5001; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);"></div>
            <div class="theme-studio-drawer" style="position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 440px; z-index: 5002; background: var(--p-surface-0, #ffffff); border-left: 1px solid var(--p-border-color, #e2e8f0); box-shadow: -10px 0 35px -5px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color, #e2e8f0);">
                    <div style="display: flex; align-items: center; gap: 0.625rem;">
                        <span style="color: var(--p-primary-600); display: flex;">${LucideIcons.sliders || "\u{1F3A8}"}</span>
                        <div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: var(--p-surface-900);">Aura Theme Studio</div>
                            <div style="font-size: 0.75rem; color: var(--p-surface-500);">Live Reactive Design System Editor</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="studio-reset-btn" title="Reset to Defaults" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; font-size: 0.75rem; border-radius: 4px;">
                            Reset
                        </button>
                        <button type="button" class="theme-studio-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; display: flex; border-radius: 4px;">
                            ${LucideIcons.x}
                        </button>
                    </div>
                </div>
                <div style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">Appearance Mode</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            <button type="button" class="mode-btn active" data-mode="light" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                ${LucideIcons.sun || "\u2600\uFE0F"} Light
                            </button>
                            <button type="button" class="mode-btn" data-mode="dark" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                ${LucideIcons.moon || "\u{1F319}"} Dark
                            </button>
                            <button type="button" class="mode-btn" data-mode="system" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                System
                            </button>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Primary Palette</span>
                            <span class="studio-primary-label" style="font-size: 0.75rem; color: var(--p-primary-600); font-weight: 700;">Emerald</span>
                        </div>
                        <div class="studio-color-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(2.1rem, 1fr)); gap: 0.4rem; margin-bottom: 0.75rem;"></div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.35rem 0.6rem;">
                            <input type="color" class="studio-custom-color-input" value="#10b981" style="width: 1.75rem; height: 1.75rem; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
                            <span style="font-size: 0.75rem; font-family: monospace; color: var(--p-surface-600);">Custom Hex Accent</span>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">Neutral Surface Base</div>
                        <div class="studio-neutral-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.35rem;"></div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Corner Radius</span>
                            <span class="studio-radius-label" style="font-family: monospace; font-size: 0.75rem; color: var(--p-primary-600); font-weight: 600;">0.5rem</span>
                        </div>
                        <div class="studio-radius-presets" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.25rem;">
                            <button type="button" class="radius-btn" data-radius="0rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">0</button>
                            <button type="button" class="radius-btn" data-radius="0.25rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">.25</button>
                            <button type="button" class="radius-btn" data-radius="0.375rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">.37</button>
                            <button type="button" class="radius-btn active" data-radius="0.5rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 2px solid var(--p-primary-500); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: bold; border-radius: 2px; cursor: pointer;">.5</button>
                            <button type="button" class="radius-btn" data-radius="0.75rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">.75</button>
                            <button type="button" class="radius-btn" data-radius="1.0rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">1.0</button>
                            <button type="button" class="radius-btn" data-radius="1.5rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">1.5</button>
                            <button type="button" class="radius-btn" data-radius="9999px" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">Pill</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Component Density</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            <button type="button" class="density-btn" data-density="compact" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Compact</button>
                            <button type="button" class="density-btn active" data-density="normal" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 2px solid var(--p-primary-500); border-radius: var(--p-border-radius); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 600; cursor: pointer;">Normal</button>
                            <button type="button" class="density-btn" data-density="spacious" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Spacious</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Shadow Elevation</div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem;">
                            <button type="button" class="shadow-btn" data-shadow="none" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Flat</button>
                            <button type="button" class="shadow-btn" data-shadow="subtle" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Subtle</button>
                            <button type="button" class="shadow-btn active" data-shadow="layered" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 2px solid var(--p-primary-500); border-radius: var(--p-border-radius); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 600; cursor: pointer;">Layered</button>
                            <button type="button" class="shadow-btn" data-shadow="bold" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">3D Bold</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Font Family</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.35rem;">
                            <button type="button" class="font-btn active" data-font="sans" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; border: 2px solid var(--p-primary-500); border-radius: var(--p-border-radius); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 600; cursor: pointer;">Jakarta</button>
                            <button type="button" class="font-btn" data-font="inter" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Inter</button>
                            <button type="button" class="font-btn" data-font="mono" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Mono</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Preset Curated Themes</div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 240px; overflow-y: auto;">
                            <button type="button" class="preset-theme-btn" data-theme="emerald-zero-trust" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #10b981;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Emerald Zero-Trust</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Default</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="krd-golden" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #eab308;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">KRD Golden</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="supabase-violet" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #8b5cf6;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Supabase Violet</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.375</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sunset-ember" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #f43f5e;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Sunset Ember</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.75</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="ocean-blue" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #3b82f6;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Ocean Blue</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="cyber-cyan" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #06b6d4;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Cyberpunk Cyan</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.0</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="lime-minimal" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #84cc16;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Lime Minimal</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.25</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sunset-orange" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #f97316;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Sunset Orange</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sakura-pink" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #ec4899;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Sakura Pink</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 1.0</span>
                            </button>
                        </div>
                    </div>
                    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1rem;">
                        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); text-transform: uppercase; margin-bottom: 0.75rem;">Interactive Live Preview</div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button type="button" class="p-button p-button-primary" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.75rem;">Primary</button>
                                <button type="button" class="p-button p-button-secondary" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.75rem;">Secondary</button>
                            </div>
                            <input type="text" value="Interactive Input" class="p-input" style="width: 100%; padding: 0.4rem 0.6rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); color: var(--p-text-color);" />
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem;">
                                <span class="aura-tag tag-emerald">Active Badge</span>
                                <span style="color: var(--p-primary-600); font-weight: bold;">75% Telemetry</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--p-border-color, #e2e8f0); background: var(--p-surface-50, #f8fafc); display: flex; flex-direction: column; gap: 0.5rem;">
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
  const toggleBtn = container.querySelector(".theme-studio-toggle-btn");
  const backdrop = container.querySelector(".theme-studio-backdrop");
  const drawer = container.querySelector(".theme-studio-drawer");
  const closeBtn = container.querySelector(".theme-studio-close-btn");
  const resetBtn = container.querySelector(".studio-reset-btn");
  const colorGrid = container.querySelector(".studio-color-grid");
  const neutralGrid = container.querySelector(".studio-neutral-grid");
  const radiusLabel = container.querySelector(".studio-radius-label");
  const primaryLabel = container.querySelector(".studio-primary-label");
  const customColorInput = container.querySelector(".studio-custom-color-input");
  const copyCssBtn = container.querySelector(".studio-copy-css-btn");
  const copyCSharpBtn = container.querySelector(".studio-copy-csharp-btn");
  colorGrid.innerHTML = Object.entries(PRIMARY_PRESETS).map(([key, p]) => `
        <button type="button" 
                class="studio-color-swatch ${key === currentPrimary ? "active" : ""}" 
                data-color="${key}" 
                title="${p.name}" 
                style="width: 100%; aspect-ratio: 1; border-radius: var(--p-border-radius, 6px); background: ${p.hex}; border: ${key === currentPrimary ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.1)"}; box-shadow: ${key === currentPrimary ? "0 0 0 2px var(--p-surface-900)" : "none"}; cursor: pointer; transition: transform 0.15s ease;">
        </button>
    `).join("");
  neutralGrid.innerHTML = Object.entries(NEUTRAL_PRESETS).map(([key, n]) => `
        <button type="button" 
                class="studio-neutral-swatch ${key === currentNeutral ? "active" : ""}" 
                data-neutral="${key}" 
                style="padding: 0.35rem 0.25rem; font-size: 0.6875rem; font-weight: 600; border: ${key === currentNeutral ? "2px solid var(--p-primary-500)" : "1px solid var(--p-border-color)"}; border-radius: var(--p-border-radius); background: ${n.s100}; color: ${n.s900}; cursor: pointer; text-align: center;">
            ${n.name}
        </button>
    `).join("");
  function applyTheme() {
    const root = document.documentElement;
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const n = NEUTRAL_PRESETS[currentNeutral] || NEUTRAL_PRESETS.slate;
    if (currentCustomHex) {
      root.style.setProperty("--p-primary-500", currentCustomHex);
      root.style.setProperty("--p-primary-600", currentCustomHex);
      root.style.setProperty("--p-primary-700", currentCustomHex);
      if (primaryLabel) primaryLabel.textContent = `Custom (${currentCustomHex})`;
    } else {
      root.style.setProperty("--p-primary-50", p.lightP50);
      root.style.setProperty("--p-primary-100", p.lightP100);
      root.style.setProperty("--p-primary-200", p.lightP200);
      root.style.setProperty("--p-primary-500", p.lightP500);
      root.style.setProperty("--p-primary-600", p.lightP600);
      root.style.setProperty("--p-primary-700", p.lightP700);
      if (primaryLabel) primaryLabel.textContent = p.name;
    }
    root.style.setProperty("--p-surface-0", n.s0);
    root.style.setProperty("--p-surface-50", n.s50);
    root.style.setProperty("--p-surface-100", n.s100);
    root.style.setProperty("--p-surface-200", n.s200);
    root.style.setProperty("--p-surface-300", n.s300);
    root.style.setProperty("--p-surface-400", n.s400);
    root.style.setProperty("--p-surface-500", n.s500);
    root.style.setProperty("--p-surface-600", n.s600);
    root.style.setProperty("--p-surface-700", n.s700);
    root.style.setProperty("--p-surface-800", n.s800);
    root.style.setProperty("--p-surface-900", n.s900);
    root.style.setProperty("--p-surface-950", n.s950);
    root.style.setProperty("--p-border-radius", currentRadius);
    const radNum = parseFloat(currentRadius) || 0;
    root.style.setProperty("--p-border-radius-lg", currentRadius === "9999px" ? "9999px" : `${radNum * 1.5}rem`);
    root.style.setProperty("--p-border-radius-xl", currentRadius === "9999px" ? "9999px" : `${radNum * 2}rem`);
    if (radiusLabel) radiusLabel.textContent = currentRadius;
    if (currentDensity === "compact") {
      root.style.setProperty("--p-content-padding", "0.625rem");
      root.style.setProperty("--p-field-padding-y", "0.35rem");
      root.style.setProperty("--p-field-padding-x", "0.5rem");
    } else if (currentDensity === "spacious") {
      root.style.setProperty("--p-content-padding", "1.5rem");
      root.style.setProperty("--p-field-padding-y", "0.65rem");
      root.style.setProperty("--p-field-padding-x", "1rem");
    } else {
      root.style.setProperty("--p-content-padding", "1rem");
      root.style.setProperty("--p-field-padding-y", "0.5rem");
      root.style.setProperty("--p-field-padding-x", "0.75rem");
    }
    if (currentShadow === "none") {
      root.style.setProperty("--p-shadow-sm", "none");
      root.style.setProperty("--p-shadow-md", "none");
      root.style.setProperty("--p-shadow-lg", "none");
    } else if (currentShadow === "subtle") {
      root.style.setProperty("--p-shadow-sm", "0 1px 2px rgba(0,0,0,0.03)");
      root.style.setProperty("--p-shadow-md", "0 2px 4px rgba(0,0,0,0.05)");
      root.style.setProperty("--p-shadow-lg", "0 4px 8px rgba(0,0,0,0.06)");
    } else if (currentShadow === "bold") {
      root.style.setProperty("--p-shadow-sm", "0 2px 4px rgba(0,0,0,0.1)");
      root.style.setProperty("--p-shadow-md", "0 8px 16px rgba(0,0,0,0.15)");
      root.style.setProperty("--p-shadow-lg", "0 16px 32px rgba(0,0,0,0.2)");
    } else {
      root.style.setProperty("--p-shadow-sm", "0 1px 2px 0 rgba(0, 0, 0, 0.05)");
      root.style.setProperty("--p-shadow-md", "0 4px 6px -1px rgba(0, 0, 0, 0.07)");
      root.style.setProperty("--p-shadow-lg", "0 10px 15px -3px rgba(0, 0, 0, 0.08)");
    }
    if (currentFont === "inter") {
      root.style.setProperty("--p-font-family", "Inter, -apple-system, sans-serif");
    } else if (currentFont === "mono") {
      root.style.setProperty("--p-font-family", "JetBrains Mono, monospace");
    } else {
      root.style.setProperty("--p-font-family", "Plus Jakarta Sans, sans-serif");
    }
    if (currentThemeMode === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else if (currentThemeMode === "light") {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    } else {
      const isSysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isSysDark);
      root.setAttribute("data-theme", isSysDark ? "dark" : "light");
    }
  }
  function open() {
    disclosure.open();
    backdrop.style.display = "block";
    drawer.style.transform = "translateX(0)";
    scrollLock.lock();
  }
  function close() {
    disclosure.close();
    drawer.style.transform = "translateX(100%)";
    setTimeout(() => {
      backdrop.style.display = "none";
    }, 250);
    scrollLock.unlock();
  }
  toggleBtn.addEventListener("click", () => {
    if (disclosure.isOpen) close();
    else open();
  });
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  container.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentThemeMode = btn.getAttribute("data-mode") || "system";
      container.querySelectorAll(".mode-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  colorGrid.querySelectorAll(".studio-color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCustomHex = "";
      currentPrimary = btn.getAttribute("data-color");
      colorGrid.querySelectorAll(".studio-color-swatch").forEach((b) => {
        const k = b.getAttribute("data-color");
        b.style.boxShadow = k === currentPrimary ? "0 0 0 2px var(--p-surface-900)" : "none";
      });
      applyTheme();
    });
  });
  if (customColorInput) {
    customColorInput.addEventListener("input", () => {
      currentCustomHex = customColorInput.value;
      applyTheme();
    });
  }
  neutralGrid.querySelectorAll(".studio-neutral-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentNeutral = btn.getAttribute("data-neutral");
      neutralGrid.querySelectorAll(".studio-neutral-swatch").forEach((b) => {
        const k = b.getAttribute("data-neutral");
        b.style.border = k === currentNeutral ? "2px solid var(--p-primary-500)" : "1px solid var(--p-border-color)";
      });
      applyTheme();
    });
  });
  container.querySelectorAll(".radius-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentRadius = btn.getAttribute("data-radius");
      container.querySelectorAll(".radius-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
        b.style.color = "inherit";
        b.style.fontWeight = "normal";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      btn.style.color = "var(--p-primary-700)";
      btn.style.fontWeight = "bold";
      applyTheme();
    });
  });
  container.querySelectorAll(".density-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentDensity = btn.getAttribute("data-density") || "normal";
      container.querySelectorAll(".density-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  container.querySelectorAll(".shadow-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentShadow = btn.getAttribute("data-shadow") || "layered";
      container.querySelectorAll(".shadow-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  container.querySelectorAll(".font-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFont = btn.getAttribute("data-font") || "sans";
      container.querySelectorAll(".font-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  container.querySelectorAll(".preset-theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCustomHex = "";
      const theme = btn.getAttribute("data-theme");
      if (theme === "emerald-zero-trust") {
        currentPrimary = "emerald";
        currentNeutral = "slate";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "krd-golden") {
        currentPrimary = "yellow";
        currentNeutral = "zinc";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "supabase-violet") {
        currentPrimary = "violet";
        currentNeutral = "zinc";
        currentRadius = "0.375rem";
        currentDensity = "compact";
      } else if (theme === "sunset-ember") {
        currentPrimary = "rose";
        currentNeutral = "stone";
        currentRadius = "0.75rem";
        currentDensity = "normal";
      } else if (theme === "ocean-blue") {
        currentPrimary = "blue";
        currentNeutral = "slate";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "cyber-cyan") {
        currentPrimary = "cyan";
        currentNeutral = "zinc";
        currentRadius = "0rem";
        currentDensity = "compact";
      } else if (theme === "lime-minimal") {
        currentPrimary = "lime";
        currentNeutral = "neutral";
        currentRadius = "0.25rem";
        currentDensity = "compact";
      } else if (theme === "sunset-orange") {
        currentPrimary = "orange";
        currentNeutral = "stone";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "sakura-pink") {
        currentPrimary = "pink";
        currentNeutral = "zinc";
        currentRadius = "1.0rem";
        currentDensity = "spacious";
      }
      applyTheme();
    });
  });
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentPrimary = "emerald";
      currentCustomHex = "";
      currentNeutral = "slate";
      currentRadius = "0.5rem";
      currentDensity = "normal";
      currentShadow = "layered";
      currentFont = "sans";
      currentThemeMode = "system";
      applyTheme();
    });
  }
  copyCssBtn.addEventListener("click", () => {
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const n = NEUTRAL_PRESETS[currentNeutral] || NEUTRAL_PRESETS.slate;
    const primaryVal = currentCustomHex || p.hex;
    const cssSnippet = `
:root {
    --p-primary-color: ${primaryVal};
    --p-primary-50: ${p.lightP50};
    --p-primary-500: ${p.lightP500};
    --p-primary-600: ${p.lightP600};
    --p-primary-700: ${p.lightP700};
    --p-surface-0: ${n.s0};
    --p-surface-50: ${n.s50};
    --p-surface-900: ${n.s900};
    --p-border-radius: ${currentRadius};
    --p-content-padding: ${currentDensity === "compact" ? "0.625rem" : currentDensity === "spacious" ? "1.5rem" : "1rem"};
}

[data-theme="dark"], .dark {
    --p-primary-50: ${p.darkP50};
    --p-surface-0: ${n.s900};
    --p-surface-50: ${n.s950};
    --p-surface-900: ${n.s50};
}`.trim();
    clipboard.copy(cssSnippet);
    copyCssBtn.innerHTML = `${LucideIcons.check} Copied to Clipboard!`;
    setTimeout(() => {
      copyCssBtn.innerHTML = `${LucideIcons.copy} Copy CSS Custom Properties`;
    }, 2e3);
  });
  copyCSharpBtn.addEventListener("click", () => {
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const primaryHex = currentCustomHex || p.hex;
    const primaryName = currentCustomHex ? "Custom" : p.name;
    const csharpSnippet = `
public static class AppTheme
{
    public const string PrimaryHex = "${primaryHex}";
    public const string PrimaryName = "${primaryName}";
    public const string NeutralBase = "${currentNeutral}";
    public const string BorderRadius = "${currentRadius}";
    public const string Density = "${currentDensity}";
}`.trim();
    clipboard.copy(csharpSnippet);
    copyCSharpBtn.innerHTML = `${LucideIcons.check} Copied C# Code!`;
    setTimeout(() => {
      copyCSharpBtn.innerHTML = `${LucideIcons.code} Copy C# Theme Tokens`;
    }, 2e3);
  });
  document.addEventListener("studio:open", open);
  document.addEventListener("studio:export", () => {
    open();
    copyCssBtn.click();
  });
  applyTheme();
}
export {
  ThemeStudioIsland as default
};
//# sourceMappingURL=theme-studio-RDH2ZQ3M.js.map
