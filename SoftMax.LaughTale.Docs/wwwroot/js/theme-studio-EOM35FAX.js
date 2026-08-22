import {
  useScrollLock
} from "./chunk-I7ZAYNYP.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

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
  }
};
function ThemeStudioIsland(container, props = {}) {
  let currentPrimary = "emerald";
  let currentRadius = "0.5rem";
  let currentNeutral = "slate";
  let currentShadow = "layered";
  const disclosure = useDisclosure({ defaultIsOpen: props.defaultOpen });
  const scrollLock = useScrollLock();
  container.innerHTML = `
        <div class="laughtale-theme-studio-root">
            <!-- Floating Launch Bubble -->
            <button type="button" 
                    class="theme-studio-toggle-btn" 
                    title="Open TweakAura Theme Studio"
                    style="position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 5000; width: 3rem; height: 3rem; border-radius: 9999px; background: var(--p-surface-900, #0f172a); color: var(--p-surface-0, #ffffff); border: 2px solid var(--p-primary-500, #10b981); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; outline: none;">
                ${LucideIcons.palette(20)}
            </button>

            <!-- Backdrop -->
            <div class="theme-studio-backdrop" style="display: none; position: fixed; inset: 0; z-index: 5001; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);"></div>

            <!-- Slide-in Drawer Panel -->
            <div class="theme-studio-drawer" style="position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 380px; z-index: 5002; background: var(--p-surface-0, #ffffff); border-left: 1px solid var(--p-border-color, #e2e8f0); box-shadow: -10px 0 25px -5px rgba(0,0,0,0.1); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;">
                
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color, #e2e8f0);">
                    <div style="display: flex; align-items: center; gap: 0.625rem;">
                        <span style="color: var(--p-primary-600); display: flex;">${LucideIcons.sliders(20)}</span>
                        <div>
                            <div style="font-size: 1rem; font-weight: 700; color: var(--p-surface-900);">TweakAura Studio</div>
                            <div style="font-size: 0.75rem; color: var(--p-surface-500);">Live shadcn-Style Theme Editor</div>
                        </div>
                    </div>
                    <button type="button" class="theme-studio-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; display: flex; border-radius: 4px;">
                        ${LucideIcons.x(20)}
                    </button>
                </div>

                <!-- Body Controls -->
                <div style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    
                    <!-- 1. Primary Palette -->
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Primary Color Palette</div>
                        <div class="studio-color-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem;"></div>
                    </div>

                    <!-- 2. Corner Radius Slider -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Corner Radius</span>
                            <span class="studio-radius-label" style="font-family: monospace; font-size: 0.75rem; color: var(--p-primary-600); font-weight: 600;">0.5rem</span>
                        </div>
                        <div class="studio-radius-presets" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.35rem;">
                            <button type="button" class="radius-btn" data-radius="0rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">0</button>
                            <button type="button" class="radius-btn" data-radius="0.25rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 4px; cursor: pointer;">0.25</button>
                            <button type="button" class="radius-btn active" data-radius="0.5rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-primary-600); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 700; border-radius: 6px; cursor: pointer;">0.5</button>
                            <button type="button" class="radius-btn" data-radius="0.75rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 8px; cursor: pointer;">0.75</button>
                            <button type="button" class="radius-btn" data-radius="1.0rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 12px; cursor: pointer;">1.0</button>
                        </div>
                    </div>

                    <!-- 3. Pre-Packaged Themes -->
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Preset Curated Themes</div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <button type="button" class="preset-theme-btn" data-theme="emerald-zero-trust" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #10b981;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Emerald Zero-Trust</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Default</span>
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
                            <button type="button" class="preset-theme-btn" data-theme="cyber-cyan" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #06b6d4;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Cyberpunk Cyan</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.0</span>
                            </button>
                        </div>
                    </div>

                    <!-- 4. Live Mini Component Preview -->
                    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1rem;">
                        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); text-transform: uppercase; margin-bottom: 0.75rem;">Live Preview</div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button type="button" class="p-button p-button-primary" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.75rem;">Primary</button>
                                <button type="button" class="p-button p-button-secondary" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.75rem;">Secondary</button>
                            </div>
                            <input type="text" value="Interactive Input" class="p-input" style="padding: 0.35rem 0.5rem; font-size: 0.75rem;" />
                        </div>
                    </div>

                </div>

                <!-- Footer Export Actions -->
                <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--p-border-color, #e2e8f0); background: var(--p-surface-50, #f8fafc); display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="studio-copy-css-btn p-button p-button-primary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.copy(16)} Copy CSS Tokens
                    </button>
                    <button type="button" class="studio-copy-csharp-btn p-button p-button-secondary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.code(16)} Copy C# Theme Tokens
                    </button>
                </div>

            </div>
        </div>
    `;
  const toggleBtn = container.querySelector(".theme-studio-toggle-btn");
  const backdrop = container.querySelector(".theme-studio-backdrop");
  const drawer = container.querySelector(".theme-studio-drawer");
  const closeBtn = container.querySelector(".theme-studio-close-btn");
  const colorGrid = container.querySelector(".studio-color-grid");
  const radiusLabel = container.querySelector(".studio-radius-label");
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
  function applyTheme() {
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const root = document.documentElement;
    root.style.setProperty("--p-primary-50", p.lightP50);
    root.style.setProperty("--p-primary-100", p.lightP100);
    root.style.setProperty("--p-primary-200", p.lightP200);
    root.style.setProperty("--p-primary-500", p.lightP500);
    root.style.setProperty("--p-primary-600", p.lightP600);
    root.style.setProperty("--p-primary-700", p.lightP700);
    root.style.setProperty("--p-border-radius", currentRadius);
    const radNum = parseFloat(currentRadius);
    root.style.setProperty("--p-border-radius-lg", `${radNum * 1.5}rem`);
    root.style.setProperty("--p-border-radius-xl", `${radNum * 2}rem`);
    radiusLabel.textContent = currentRadius;
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
  colorGrid.querySelectorAll(".studio-color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPrimary = btn.getAttribute("data-color");
      colorGrid.querySelectorAll(".studio-color-swatch").forEach((b) => {
        const k = b.getAttribute("data-color");
        b.style.boxShadow = k === currentPrimary ? "0 0 0 2px var(--p-surface-900)" : "none";
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
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-600)";
      btn.style.background = "var(--p-primary-50)";
      btn.style.color = "var(--p-primary-700)";
      applyTheme();
    });
  });
  container.querySelectorAll(".preset-theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      if (theme === "emerald-zero-trust") {
        currentPrimary = "emerald";
        currentRadius = "0.5rem";
      } else if (theme === "supabase-violet") {
        currentPrimary = "violet";
        currentRadius = "0.375rem";
      } else if (theme === "sunset-ember") {
        currentPrimary = "rose";
        currentRadius = "0.75rem";
      } else if (theme === "cyber-cyan") {
        currentPrimary = "cyan";
        currentRadius = "0rem";
      }
      applyTheme();
    });
  });
  copyCssBtn.addEventListener("click", () => {
    const p = PRIMARY_PRESETS[currentPrimary];
    const cssSnippet = `
:root {
    --p-primary-50: ${p.lightP50};
    --p-primary-100: ${p.lightP100};
    --p-primary-200: ${p.lightP200};
    --p-primary-500: ${p.lightP500};
    --p-primary-600: ${p.lightP600};
    --p-primary-700: ${p.lightP700};
    --p-border-radius: ${currentRadius};
}

html.dark {
    --p-primary-50: ${p.darkP50};
    --p-primary-100: ${p.darkP100};
    --p-primary-200: ${p.darkP200};
}`.trim();
    navigator.clipboard.writeText(cssSnippet);
    copyCssBtn.innerHTML = `${LucideIcons.check(16)} Copied to Clipboard!`;
    setTimeout(() => {
      copyCssBtn.innerHTML = `${LucideIcons.copy(16)} Copy CSS Tokens`;
    }, 2e3);
  });
  copyCSharpBtn.addEventListener("click", () => {
    const p = PRIMARY_PRESETS[currentPrimary];
    const csharpSnippet = `
public static class AppTheme
{
    public const string PrimaryHex = "${p.hex}";
    public const string PrimaryName = "${p.name}";
    public const string BorderRadius = "${currentRadius}";
}`.trim();
    navigator.clipboard.writeText(csharpSnippet);
    copyCSharpBtn.innerHTML = `${LucideIcons.check(16)} Copied C# Code!`;
    setTimeout(() => {
      copyCSharpBtn.innerHTML = `${LucideIcons.code(16)} Copy C# Theme Tokens`;
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
//# sourceMappingURL=theme-studio-EOM35FAX.js.map
