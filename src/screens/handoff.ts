// ===== 8. スマホ受け渡し画面 =====
// 運命の扉。名前以外の情報を出さない。全参加者で同じ背景・色・演出（秘匿）。

import { navigate } from "../router";
import { currentName, getState } from "../state";
import { messageWindow } from "../components/message-window";
import { commandMenu } from "../components/command-menu";
import { div } from "../dom";

export function handoffScreen(): HTMLElement {
  const root = div("scene scene--handoff");
  const name = currentName();
  const isAction = getState().phase === "action";

  const door = div("fate-door", div("fate-door-lock"), div("fate-door-seam"));
  root.appendChild(div("fate-door-frame", door));

  // 名前は textContent 経由で挿入（XSS 安全）
  const text = isAction
    ? `つぎは「${name}」さんの\nアクションカードの番です。\n\nスマホを渡してください。`
    : `つぎの冒険者は\n「${name}」さんです。\n\nスマホを渡してください。`;
  const msg = messageWindow(text);
  root.appendChild(msg.el);

  const menu = commandMenu([
    { label: "本人確認へ", onSelect: () => navigate("identity") },
  ]);
  root.appendChild(menu);

  return root;
}
