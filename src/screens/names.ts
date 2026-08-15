// ===== 6. 名前入力画面 =====
// 参加者を「冒険者登録」。名前ごとに毛色ランダムの猫が出現（毛色は役職と連動しない）。

import { navigate } from "../router";
import { getState, setNames } from "../state";
import { messageWindow } from "../components/message-window";
import { commandMenu } from "../components/command-menu";
import { renderCat } from "../pixel";
import { h, div } from "../dom";

const PREVIEW_FURS = ["#e8b45a", "#d9d2c5", "#4a4a52", "#a9805a", "#c9c2b6", "#e0a87e", "#8a6f52", "#b0b7bd"];

export function namesScreen(): HTMLElement {
  const root = div("scene scene--names");
  const n = getState().playerCount;

  const msg = messageWindow("冒険者たちの\nなまえを登録するのニャ！");
  root.appendChild(msg.el);

  const inputs: HTMLInputElement[] = [];
  const list = div("name-list");

  for (let i = 0; i < n; i++) {
    const fur = PREVIEW_FURS[Math.floor(Math.random() * PREVIEW_FURS.length)];
    const catBox = div("name-cat is-empty");
    const cat = renderCat(fur, 3);
    catBox.appendChild(cat);

    const label = h("span", { class: "name-no", text: `冒険者 ${String(i + 1).padStart(2, "0")}` });

    const input = h("input", {
      class: "name-input",
      type: "text",
      maxlength: 8,
      autocomplete: "off",
      placeholder: "なまえ",
      "aria-label": `冒険者 ${i + 1} のなまえ`,
    }) as HTMLInputElement;
    input.addEventListener("input", () => {
      catBox.classList.toggle("is-empty", input.value.trim().length === 0);
    });
    inputs.push(input);

    list.appendChild(div("name-row", catBox, div("name-field", label, input)));
  }

  root.appendChild(list);

  const menu = commandMenu([
    {
      label: "冒険をはじめる",
      onSelect: () => {
        setNames(inputs.map((i) => i.value));
        navigate("draw");
      },
    },
  ]);
  root.appendChild(menu);

  return root;
}
