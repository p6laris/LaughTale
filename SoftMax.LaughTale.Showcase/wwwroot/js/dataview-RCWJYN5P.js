import {
  LucideIcons
} from "./chunk-PRHJLIKH.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/dataview.ts
function DataViewIsland(container, props) {
  let layout = props.layout || "list";
  const items = props.items || [];
  injectIslandStyle("dataview", `
        .laughtale-dataview {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            font-family: var(--p-font-family, inherit);
        }
        .dataview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--p-surface-50);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
        }
        .dataview-layout-options {
            display: flex;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            overflow: hidden;
        }
        .dataview-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            background: transparent;
            border: none;
            color: var(--p-text-muted-color);
            cursor: pointer;
            transition: all 150ms ease;
        }
        .dataview-btn:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .dataview-btn.active {
            background: var(--p-primary-50);
            color: var(--p-primary-color);
        }
        [data-theme="dark"] .dataview-btn.active {
            background: var(--p-primary-900);
        }
        
        .dataview-content {
            display: grid;
            gap: 1rem;
        }
        .dataview-content.list {
            grid-template-columns: 1fr;
        }
        .dataview-content.grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }

        .dataview-item-list {
            display: flex;
            padding: 1rem;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            gap: 1rem;
            align-items: center;
            transition: box-shadow 150ms ease;
        }
        .dataview-item-grid {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            gap: 1rem;
            transition: box-shadow 150ms ease;
        }
        .dataview-item-list:hover, .dataview-item-grid:hover {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        }
    `);
  function renderContent() {
    return items.map((item) => {
      if (layout === "list") {
        return `
                    <div class="dataview-item-list">
                        <div style="flex: 1;">${item.name || item.title || JSON.stringify(item)}</div>
                    </div>
                `;
      } else {
        return `
                    <div class="dataview-item-grid">
                        <div style="font-weight: 600;">${item.name || item.title || JSON.stringify(item)}</div>
                    </div>
                `;
      }
    }).join("");
  }
  function render() {
    container.innerHTML = `
<div class="laughtale-dataview">
                <div class="dataview-header">
                    <div class="dataview-start">
                        <!-- Custom content like sorting could go here -->
                    </div>
                    <div class="dataview-end">
                        <div class="dataview-layout-options">
                            <button class="dataview-btn ' + layout === 'list' ? 'active' : '' + '" data-layout="list" aria-label="List View">
                                ${LucideIcons.moreHorizontal}
                            </button>
                            <button class="dataview-btn ${layout === "grid" ? "active" : ""}" data-layout="grid" aria-label="Grid View">
                                ${LucideIcons.layers}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="dataview-content ${layout}">
                    ${renderContent()}
                </div>
            </div>
`;
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".dataview-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        layout = e.currentTarget.dataset.layout;
        render();
      });
    });
  }
  render();
}
export {
  DataViewIsland as default
};
//# sourceMappingURL=dataview-RCWJYN5P.js.map
