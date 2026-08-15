// ===== 7. 役職抽選画面 =====
// 宝箱が揺れ、光が漏れ、足跡が横切る。1.5〜2秒。タップでスキップ可。
// 【秘匿】この画面では役職を一切表示しない。抽選中に役職名を出さない。

import { navigate } from "../router";
import { drawRoles } from "../state";
import { sfx } from "../sfx";
import { h, div } from "../dom";

export function drawScreen(): HTMLElement {
  // 役職割当をここで実行（秘匿。メモリ内のみ）
  drawRoles();

  const root = div("scene scene--draw");

  const chest = div(
    "chest is-shaking",
    div("chest-lid"),
    div("chest-body"),
    div("chest-glow"),
  );
  const paws = div("paw-trail", div("paw paw--1"), div("paw paw--2"), div("paw paw--3"), div("paw paw--4"));

  const caption = h("p", { class: "draw-caption", text: "運命の役職を 決めている……。" });
  const skipHint = h("p", { class: "skip-hint", text: "タップでスキップ" });

  root.append(div("draw-stage", chest, paws), caption, skipHint);

  const timers: number[] = [];
  let finished = false;

  const after = (ms: number, fn: () => void): void => {
    timers.push(window.setTimeout(fn, ms));
  };

  // タイムライン
  after(150, () => sfx.chest());
  after(1500, revealDone);

  function revealDone(): void {
    if (finished) return;
    finished = true;
    timers.forEach((t) => window.clearTimeout(t));
    chest.classList.remove("is-shaking");
    chest.classList.add("is-closing");
    paws.classList.add("is-hidden");
    caption.textContent = "すべての運命が決まった！";
    skipHint.remove();
    window.setTimeout(() => navigate("handoff"), 900);
  }

  // タップでスキップ
  root.addEventListener("click", () => {
    if (!finished) revealDone();
  });

  return root;
}
