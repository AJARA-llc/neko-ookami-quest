// ===== 5. 人数入力画面 =====
// 参加人数を「冒険者の人数」として入力。カウンター前に並ぶ猫の数が増減する。

import { navigate } from "../router";
import { getState, setPlayerCount } from "../state";
import { MIN_PLAYERS, MAX_PLAYERS, clampPlayers } from "../roles";
import { messageWindow } from "../components/message-window";
import { commandMenu } from "../components/command-menu";
import { renderCat } from "../pixel";
import { sfx } from "../sfx";
import { h, div } from "../dom";

const RECEPTION_FURS = ["#e8b45a", "#d9d2c5", "#4a4a52", "#a9805a", "#c9c2b6", "#e0a87e", "#8a6f52", "#b0b7bd"];

export function countScreen(): HTMLElement {
  const root = div("scene scene--reception");
  let count = clampPlayers(getState().playerCount);

  root.append(div("reception-bg", div("guild-master"), div("quest-board")));

  const msg = messageWindow("こんやの宴には\nなんびきのネコが参加する？");
  root.appendChild(msg.el);

  const numberEl = h("span", { class: "count-number", text: `${count}` });
  const unitEl = h("span", { class: "count-unit", text: "びき" });

  const minus = h("button", {
    class: "count-btn",
    type: "button",
    "aria-label": "減らす",
    text: "−",
    onclick: () => change(-1),
  });
  const plus = h("button", {
    class: "count-btn",
    type: "button",
    "aria-label": "増やす",
    text: "＋",
    onclick: () => change(1),
  });

  const stepper = div("count-stepper", minus, div("count-display", numberEl, unitEl), plus);
  const catRow = div("cat-row");

  root.append(div("count-panel", stepper, catRow));

  const menu = commandMenu([
    {
      label: "なまえを入力する",
      onSelect: () => {
        setPlayerCount(count);
        navigate("names");
      },
    },
  ]);
  root.appendChild(menu);

  function change(delta: number): void {
    const next = clampPlayers(count + delta);
    if (next === count) {
      sfx.cancel();
      return;
    }
    count = next;
    numberEl.textContent = `${count}`;
    minus.toggleAttribute("disabled", count <= MIN_PLAYERS);
    plus.toggleAttribute("disabled", count >= MAX_PLAYERS);
    sfx.cursor();
    renderCatRow();
  }

  function renderCatRow(): void {
    catRow.replaceChildren();
    for (let i = 0; i < count; i++) {
      const wrap = div("cat-row-item");
      wrap.appendChild(renderCat(RECEPTION_FURS[i % RECEPTION_FURS.length], 3));
      wrap.style.animationDelay = `${i * 60}ms`;
      catRow.appendChild(wrap);
    }
  }

  renderCatRow();
  return root;
}
