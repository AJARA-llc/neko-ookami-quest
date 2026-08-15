// ===== アクションカード確認画面（アクションフェイズ・受け渡し2周目） =====
// 【秘匿】役職表示と同じ作法:
//  - タイムラインはカード内容に依らず一定
//  - カードは本人確認後に canvas/DOM 生成、確認後は破棄して再表示不可
//  - ホームズの「覗き」は相手のアクションカードのみ表示（役職・秘匿タスクは見えない）

import { navigate } from "../router";
import {
  currentRole,
  currentActionCard,
  actionCardOf,
  otherPlayers,
  confirmCurrentPlayer,
  isAllConfirmed,
} from "../state";
import { SECRET_TASK, canPeek } from "../actions";
import { messageWindow } from "../components/message-window";
import { commandMenu, type Command } from "../components/command-menu";
import { sfx } from "../sfx";
import { h, div } from "../dom";

const T_OPEN = 350;
const T_CARD = 850;

export function actionDrawScreen(): HTMLElement {
  const root = div("scene scene--action");

  const role = currentRole();
  const card = currentActionCard();
  const secret = SECRET_TASK[role];

  const chest = div("reveal-chest", div("chest-lid"), div("chest-body"), div("chest-glow"));
  const stage = div("reveal-stage", chest);
  root.appendChild(stage);

  // アクションカード本体（初期非表示）
  const cardEl = div("action-card");
  cardEl.append(
    h("p", { class: "action-lead", text: "きみのアクション" }),
    div("action-face", div("action-face-pip"), h("p", { class: "action-text", text: card })),
  );
  if (secret) {
    cardEl.appendChild(h("p", { class: "action-secret", text: secret }));
  }

  const menuSlot = div("menu-slot");

  const timers: number[] = [];
  timers.push(window.setTimeout(() => {
    chest.classList.add("is-open");
    sfx.reveal();
  }, T_OPEN));
  timers.push(window.setTimeout(() => {
    stage.classList.add("is-dimmed");
    cardEl.classList.add("is-shown");
    root.appendChild(cardEl);
    root.appendChild(menuSlot);
    showOwnMenu();
  }, T_CARD));

  // ---- 自分のカード表示時のメニュー ----
  function showOwnMenu(): void {
    const commands: Command[] = [];
    if (canPeek(role)) {
      commands.push({ label: "だれかのカードを覗く", onSelect: showPeekPicker });
    }
    commands.push({ label: "アクションを確認した", onSelect: onConfirm });
    menuSlot.replaceChildren(commandMenu(commands));
  }

  // ---- ホームズ: 覗く相手を選ぶ ----
  function showPeekPicker(): void {
    const targets: Command[] = otherPlayers().map((p) => ({
      label: `${p.name} さんのカード`,
      onSelect: () => showPeekedCard(p.index, p.name),
    }));
    targets.push({ label: "やめる", cancel: true, onSelect: showOwnMenu });
    menuSlot.replaceChildren(
      messageWindow("だれのカードを 覗く？").el,
      commandMenu(targets),
    );
  }

  // ---- ホームズ: 相手のアクションカードを表示（役職は見えない） ----
  function showPeekedCard(index: number, name: string): void {
    const peeked = div(
      "peek-card",
      h("p", { class: "peek-name", text: `${name} さんのカード` }),
      div("action-face action-face--peek", h("p", { class: "action-text", text: actionCardOf(index) })),
    );
    menuSlot.replaceChildren(
      peeked,
      commandMenu([
        { label: "別の人を覗く", onSelect: showPeekPicker },
        { label: "覗きおわった", cancel: true, onSelect: showOwnMenu },
      ]),
    );
  }

  // ---- 確認して次へ ----
  function onConfirm(): void {
    timers.forEach((t) => window.clearTimeout(t));
    cardEl.classList.add("is-flipping");
    menuSlot.replaceChildren();

    window.setTimeout(() => {
      cardEl.replaceChildren();
      cardEl.remove();
      confirmCurrentPlayer();

      const memo = messageWindow("アクションを おぼえた！\nカードの内容は ないしょ……。");
      root.appendChild(memo.el);

      window.setTimeout(() => {
        if (isAllConfirmed()) navigate("quest");
        else navigate("handoff");
      }, 1300);
    }, 500);
  }

  return root;
}
