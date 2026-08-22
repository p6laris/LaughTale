// ../SoftMax.LaughTale.Client/src/components/terminal.ts
function TerminalIsland(container, props) {
  const promptPrefix = props.prompt || "admin@softmax:~$";
  const welcome = props.welcomeMessage || 'Welcome to SoftMax.LaughTale CLI v3.0\nType "help" for available commands.';
  const commands = {
    "help": "Available commands: help, clear, status, date, version, info",
    "status": "All Islands hydrated: 100% OK. System latency: 0.8ms.",
    "version": "SoftMax.LaughTale Framework v3.0 (.NET 10 & TS)",
    "info": "Architecture: SSR + Micro-Directives + Islands + Tailwind CSS v4",
    "date": (/* @__PURE__ */ new Date()).toISOString(),
    ...props.commands || {}
  };
  const history = [];
  function render() {
    container.innerHTML = `
            <div class="laughtale-terminal" style="background: #030712; color: #38bdf8; font-family: var(--p-font-mono, monospace); font-size: 0.8125rem; border-radius: var(--p-border-radius-lg); border: 1px solid #1f2937; box-shadow: var(--p-shadow-lg); padding: 1.25rem; width: 100%; max-width: 640px; min-height: 240px; display: flex; flex-direction: column; overflow: hidden;">
                <!-- Header Controls -->
                <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.875rem; border-bottom: 1px solid #1f2937; padding-bottom: 0.625rem;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                    <span style="color: #64748b; font-size: 0.6875rem; margin-left: 0.5rem;">bash \u2014 80x24</span>
                </div>

                <!-- History Log -->
                <div class="terminal-log" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem;">
                    <div style="color: #94a3b8; white-space: pre-wrap; margin-bottom: 0.5rem;">${welcome}</div>
                    ${history.map((h) => `
                        <div>
                            <div style="color: #4ade80;"><span style="color: #64748b;">${promptPrefix}</span> ${h.command}</div>
                            ${h.response ? `<div style="color: #e2e8f0; white-space: pre-wrap; margin-left: 0.5rem;">${h.response}</div>` : ""}
                        </div>
                    `).join("")}
                </div>

                <!-- Active Prompt Line -->
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                    <span style="color: #4ade80; user-select: none;">${promptPrefix}</span>
                    <input type="text" class="terminal-input" style="flex: 1; background: transparent; border: none; outline: none; color: #f8fafc; font-family: inherit; font-size: inherit;" autofocus />
                </div>
            </div>
        `;
    const input = container.querySelector(".terminal-input");
    const log = container.querySelector(".terminal-log");
    log.scrollTop = log.scrollHeight;
    input.focus();
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value.trim();
        if (!cmd) return;
        if (cmd === "clear") {
          history.length = 0;
        } else {
          const resp = commands[cmd.toLowerCase()] || `Command not found: "${cmd}". Type "help" for a list of commands.`;
          history.push({ command: cmd, response: resp });
        }
        render();
      }
    });
  }
  render();
}
export {
  TerminalIsland as default
};
//# sourceMappingURL=terminal-ZCYBZOBG.js.map
