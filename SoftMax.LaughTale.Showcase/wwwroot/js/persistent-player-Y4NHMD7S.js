import {
  injectIslandStyle
} from "./chunk-UX4GO4Y6.js";

// Scripts/islands/persistent-player.ts
function PersistentPlayerIsland(container, props) {
  injectIslandStyle("persistent-player", `
        .player-pulse {
            animation: pulse-glow 2s infinite ease-in-out;
        }
        @keyframes pulse-glow {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
        }
    `);
  let isPlaying = false;
  let secondsElapsed = 0;
  let timer = null;
  container.innerHTML = `
        <div class="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-2xl flex items-center gap-3 shadow-lg">
            <div class="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm play-icon cursor-pointer player-pulse">
                \u25B6
            </div>
            <div class="text-left">
                <div class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 status-dot"></span>
                    <span>${props.stationName}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono time-display">
                    Paused &bull; 00:00
                </div>
            </div>
            <button class="toggle-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 transition ml-2">
                Play
            </button>
            <span class="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded ml-1">
                data-persist
            </span>
        </div>
    `;
  const playIcon = container.querySelector(".play-icon");
  const toggleBtn = container.querySelector(".toggle-btn");
  const timeDisplay = container.querySelector(".time-display");
  const statusDot = container.querySelector(".status-dot");
  const toggle = () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.textContent = "\u23F8";
      toggleBtn.textContent = "Pause";
      statusDot.classList.add("bg-emerald-400", "animate-ping");
      statusDot.classList.remove("bg-slate-500");
      timer = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, "0");
        const secs = (secondsElapsed % 60).toString().padStart(2, "0");
        timeDisplay.textContent = `Playing \u2022 ${mins}:${secs}`;
      }, 1e3);
    } else {
      playIcon.textContent = "\u25B6";
      toggleBtn.textContent = "Play";
      statusDot.classList.remove("bg-emerald-400", "animate-ping");
      statusDot.classList.add("bg-slate-500");
      clearInterval(timer);
      const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, "0");
      const secs = (secondsElapsed % 60).toString().padStart(2, "0");
      timeDisplay.textContent = `Paused \u2022 ${mins}:${secs}`;
    }
  };
  toggleBtn.addEventListener("click", toggle);
  playIcon.addEventListener("click", toggle);
}
export {
  PersistentPlayerIsland as default
};
//# sourceMappingURL=persistent-player-Y4NHMD7S.js.map
