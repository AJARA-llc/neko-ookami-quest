// ===== 13. 全員確認完了画面 =====
// 全員の猫が集合。宴の開始。誰が猫狼か推測できる演出は入れない
//   （シルエットは特定の席・毛色に紐づかない汎用の影のみ）。

import { navigate } from "../router";
import { getState } from "../state";
import { messageWindow } from "../components/message-window";
import { commandMenu } from "../components/command-menu";
import { renderCat, renderMug } from "../pixel";
import { sfx } from "../sfx";
import { h, div } from "../dom";

export function allConfirmedScreen(): HTMLElement {
  const root = div("scene scene--gather");
  const { names, furColors } = getState();

  // 紙吹雪
  const confetti = div("confetti");
  for (let i = 0; i < 18; i++) {
    const piece = h("span", { class: "confetti-piece" });
    piece.style.left = `${(i * 5.5) % 100}%`;
    piece.style.animationDelay = `${(i % 6) * 120}ms`;
    piece.style.setProperty("--c", ["#f2d34a", "#ff6b8a", "#7fd6ff", "#a7e08a"][i % 4]);
    confetti.appendChild(piece);
  }
  root.appendChild(confetti);

  // QUEST START ドット文字 + 汎用シルエット一瞬
  root.append(
    h("p", { class: "quest-start-banner", text: "QUEST START" }),
    h("div", { class: "wolf-shadow", "aria-hidden": "true" }),
  );

  const msg = messageWindow(
    "すべての冒険者が\n自分の運命を確認した！\n\nさあ、宴のはじまりだ！",
  );
  root.appendChild(msg.el);

  // 集合した猫たち（ジョッキを掲げる）
  const crowd = div("crowd");
  for (let i = 0; i < names.length; i++) {
    const member = div("crowd-member");
    member.style.animationDelay = `${i * 90}ms`;
    const catCanvas = renderCat(furColors[i] ?? "#d9d2c5", 3);
    const mug = div("crowd-mug");
    mug.appendChild(renderMug(2));
    member.append(mug, catCanvas, h("span", { class: "crowd-name", text: names[i] }));
    crowd.appendChild(member);
  }
  root.appendChild(crowd);

  const menu = commandMenu([
    {
      label: "宴をはじめる",
      onSelect: () => {
        sfx.fanfare();
        navigate("quest");
      },
    },
  ]);
  root.appendChild(menu);

  return root;
}
