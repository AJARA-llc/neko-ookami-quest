// ===== 音声 ON/OFF トグル（画面上部に常設） =====

import { toggleSound, getState } from "../state";
import { primeAudio, sfx } from "../sfx";

export function soundToggle(): HTMLElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sound-toggle";
  render();

  btn.addEventListener("click", () => {
    primeAudio();
    const on = toggleSound();
    if (on) sfx.decide();
    render();
  });

  function render(): void {
    const on = getState().soundEnabled;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "音声オン" : "音声オフ");
    btn.textContent = on ? "♪ ON" : "♪ OFF";
  }

  return btn;
}
