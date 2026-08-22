import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/orgchart.ts
var CSS = `
[data-theme="dark"] .orgchart-node-table {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .orgchart-node-card {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-orgchart {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function OrgChartIsland(container, props) {
  injectIslandStyle("orgchart", CSS);
  const rootNode = props.value || {
    key: "0",
    label: "Chief Technology Officer",
    title: "Executive Leadership",
    children: [
      {
        key: "0_0",
        label: "Engineering Director",
        title: "Core Infrastructure",
        children: [
          { key: "0_0_0", label: "Kernel Lead", title: "Compiler & Runtime" },
          { key: "0_0_1", label: "Security Lead", title: "Zero-Trust Protocol" }
        ]
      },
      {
        key: "0_1",
        label: "Product Director",
        title: "Developer Experience",
        children: [
          { key: "0_1_0", label: "Design System Lead", title: "Aura Theme Engine" }
        ]
      }
    ]
  };
  function renderNode(node) {
    const hasChildren = node.children && node.children.length > 0;
    return `
            <table class="orgchart-node-table" style="border-collapse: separate; border-spacing: 0; margin: 0 auto;">
                <tr>
                    <td colspan="${hasChildren ? node.children.length * 2 : 2}" align="center" style="padding-bottom: 1rem;">
                        <div class="orgchart-node-card" data-key="${node.key}" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.75rem 1rem; box-shadow: var(--p-shadow-sm); cursor: pointer; min-width: 140px; text-align: center; transition: all 0.15s ease;">
                            <div style="font-size: 0.8125rem; font-weight: 700; color: var(--p-surface-900);">${node.label}</div>
                            ${node.title ? `<div style="font-size: 0.6875rem; color: var(--p-primary-600); font-weight: 600; margin-top: 0.15rem;">${node.title}</div>` : ""}
                        </div>
                    </td>
                </tr>
                ${hasChildren ? `
                    <tr>
                        <td colspan="${node.children.length * 2}" align="center">
                            <div style="width: 1px; height: 16px; background: var(--p-border-color); margin: 0 auto;"></div>
                        </td>
                    </tr>
                    <tr>
                        ${node.children.map((child, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === node.children.length - 1;
      const isOnly = node.children.length === 1;
      return `
                                <td align="center" style="border-top: ${isOnly ? "none" : isFirst ? "none" : "1px solid var(--p-border-color)"}; border-right: ${isOnly || isLast ? "none" : "1px solid var(--p-border-color)"}; padding: 0 0.5rem;">
                                    <div style="width: 1px; height: 16px; background: var(--p-border-color); margin: 0 auto;"></div>
                                    ${renderNode(child)}
                                </td>
                            `;
    }).join("")}
                    </tr>
                ` : ""}
            </table>
        `;
  }
  container.innerHTML = `
        <div class="laughtale-orgchart" style="width: 100%; overflow-x: auto; padding: 1.5rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); font-family: var(--p-font-family, inherit);">
            ${renderNode(rootNode)}
        </div>
    `;
  container.querySelectorAll(".orgchart-node-card").forEach((el) => {
    el.addEventListener("click", () => {
      const key = el.getAttribute("data-key");
      container.dispatchEvent(new CustomEvent("orgchart:select", {
        bubbles: true,
        detail: { key }
      }));
    });
  });
}
export {
  OrgChartIsland as default
};
//# sourceMappingURL=orgchart-OW5A37SL.js.map
