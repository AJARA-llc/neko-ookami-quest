// ===== 9. 本人確認画面 =====
// 「あなたは『NAME』さんですか？」はい→鍵が開いて役職確認へ。ちがいます→本人へ渡す案内。

import { navigate } from "../router";
import { currentName } from "../state";
import { messageWindow } from "../components/message-window";
import { commandMenu, type Command } from "../components/command-menu";
import { sfx } from "../sfx";
import { div } from "../dom";

export function identityScreen(): HTMLElement {
  const root = div("scene scene--identity");
  const name = currentName();

  const door = div("fate-door", div("fate-door-lock"), div("fate-door-seam"));
  const frame = div("fate-door-frame", door);
  root.appendChild(frame);

  const msg = messageWindow(`あなたは\n「${name}」さんですか？`);
  root.appendChild(msg.el);

  const menuSlot = div("menu-slot");
  root.appendChild(menuSlot);

  const yes: Command = {
    label: "はい、わたしです",
    onSelect: () => {
      door.classList.add("is-unlocked");
      window.setTimeout(() => navigate("reveal"), 560);
    },
  };
  const no: Command = {
    label: "ちがいます",
    cancel: true,
    onSelect: () => {
      sfx.cancel();
      const notice = messageWindow("本人にスマホを渡してください。");
      const back = commandMenu([{ label: "受け渡しにもどる", cancel: true, onSelect: () => navigate("handoff") }]);
      menuSlot.replaceChildren(notice.el, back);
    },
  };

  menuSlot.appendChild(commandMenu([yes, no]));
  return root;
}
