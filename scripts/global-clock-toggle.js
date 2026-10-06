const MODULE_ID = "global-clock-toggle";
const SETTINGS = { visible: "visible" };
const STYLE_ID = `${MODULE_ID}-visibility-style`;

function clocksVisible() {
  return game.settings.get(MODULE_ID, SETTINGS.visible);
}

function applyClockVisibility() {
  document.getElementById(STYLE_ID)?.remove();
  if (clocksVisible()) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = "#clock-panel { display: none !important; }";
  document.head.append(style);
}

async function toggleClockVisibility() {
  await game.settings.set(MODULE_ID, SETTINGS.visible, !clocksVisible());
  ui.controls?.render({ force: true });
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, SETTINGS.visible, {
    name: "Show Global Progress Clocks",
    hint: "Show clocks from Global Progress Clocks on this client. This never changes other users’ displays.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    requiresReload: false,
    onChange: applyClockVisibility
  });
  game.keybindings.register(MODULE_ID, "toggle", {
    name: "Toggle Global Progress Clocks",
    hint: "Show or hide all Global Progress Clocks on this client.",
    editable: [{ key: "KeyG", modifiers: ["CONTROL", "SHIFT"] }],
    onDown: () => { toggleClockVisibility(); return true; },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

Hooks.once("ready", applyClockVisibility);

Hooks.on("getSceneControlButtons", (controls) => {
  const tokenTools = controls.tokens?.tools;
  if (!tokenTools || tokenTools[MODULE_ID]) return;
  tokenTools[MODULE_ID] = {
    name: MODULE_ID,
    title: "Toggle Global Progress Clocks",
    icon: clocksVisible() ? "fa-solid fa-eye" : "fa-solid fa-eye-slash",
    order: Object.keys(tokenTools).length,
    button: true,
    visible: true,
    onChange: toggleClockVisibility
  };
});
