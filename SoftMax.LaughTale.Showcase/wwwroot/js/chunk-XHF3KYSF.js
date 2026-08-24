// ../SoftMax.LaughTale.Client/src/icons/lucide.ts
var ALIASES = {
  "refresh": "refresh-cw",
  "refreshcw": "refresh-cw",
  "refreshccw": "refresh-ccw",
  "times": "x",
  "close": "x",
  "sharealt": "share-2",
  "share2": "share-2",
  "externallink": "external-link",
  "spinner": "loader-circle",
  "loader2": "loader-circle",
  "loader": "loader-circle",
  "pencil": "pencil",
  "edit": "pencil",
  "edit3": "pencil",
  "trash": "trash-2",
  "trash2": "trash-2",
  "arrowup": "arrow-up",
  "arrowdown": "arrow-down",
  "arrowleft": "arrow-left",
  "arrowright": "arrow-right",
  "chevrondown": "chevron-down",
  "chevronup": "chevron-up",
  "chevronleft": "chevron-left",
  "chevronright": "chevron-right",
  "chevronsleft": "chevrons-left",
  "chevronsright": "chevrons-right",
  "chevronsup": "chevrons-up",
  "chevronsdown": "chevrons-down",
  "plus": "plus",
  "minus": "minus",
  "layers": "layers",
  "check": "check",
  "search": "search",
  "settings": "settings",
  "cog": "settings",
  "eye": "eye",
  "eyeoff": "eye-off",
  "alertcircle": "circle-alert",
  "alerttriangle": "triangle-alert",
  "terminal": "terminal",
  "palette": "palette",
  "sliders": "sliders-horizontal",
  "sun": "sun",
  "moon": "moon",
  "code": "code",
  "heart": "heart",
  "save": "save",
  "print": "print",
  "copy": "copy",
  "upload": "upload",
  "download": "download",
  "user": "user",
  "users": "users",
  "bell": "bell",
  "home": "home",
  "lock": "lock",
  "unlock": "unlock",
  "calendar": "calendar",
  "clock": "clock",
  "star": "star",
  "zap": "zap"
};
function normalizeLucideId(name) {
  if (!name) return "zap";
  const kebab = name.trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/_/g, "-");
  const cleanKey = kebab.replace(/-/g, "");
  if (ALIASES[cleanKey]) {
    return ALIASES[cleanKey];
  }
  if (ALIASES[kebab]) {
    return ALIASES[kebab];
  }
  return kebab;
}
function getLucideIcon(name, size = 16, strokeWidth = 2) {
  if (!name) return "";
  const iconId = normalizeLucideId(name);
  return `<svg class="p-icon p-icon-${iconId}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><use href="/icons/lucide-sprites.svg#${iconId}"></use></svg>`;
}
var LucideIcons = new Proxy({}, {
  get: (_, prop) => {
    if (typeof prop === "string") {
      return getLucideIcon(prop);
    }
    return "";
  }
});

export {
  getLucideIcon,
  LucideIcons
};
//# sourceMappingURL=chunk-XHF3KYSF.js.map
