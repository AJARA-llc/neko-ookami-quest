// ===== 10-12. 役職表示画面（ステータスカード） =====
// 【秘匿・最優先】
//  - タイムラインは役職に依らず完全に一定（読み込み時間・演出尺を変えない）
//  - 役職表示前（暗転〜宝箱）は全役職で同一の見た目・色
//  - スプライトは canvas 生成（役職名を含む画像/URL を一切読み込まない）
//  - 効果音は共通の reveal のみ（役職固有音は鳴らさない＝周囲に漏らさない）
//  - 「確認した」後は役職 DOM を破棄し、同じ参加者の画面を二度と再表示しない

import { navigate } from "../router";
import { currentRole, confirmCurrentPlayer, isAllConfirmed } from "../state";
import { ROLES } from "../roles";
import { renderRoleSprite } from "../pixel";
import { messageWindow } from "../components/message-window";
import { commandMenu } from "../components/command-menu";
import { sfx } from "../sfx";
import { h, div } from "../dom";

// 統一タイムライン（ms）。すべての役職で同一。
const T_OPEN = 350;
const T_CARD = 850;

export function revealScreen(): HTMLElement {
  const root = div("scene scene--reveal");

  const role = ROLES[currentRole()];

  // 暗転 + 宝箱（全役職共通の見た目）
  const chest = div("reveal-chest", div("chest-lid"), div("chest-body"), div("chest-glow"));
  const stage = div("reveal-stage", chest);
  root.appendChild(stage);

  // カード本体（初期は非表示。テーマ色はカードにのみ適用＝画面全体の色は変えない）
  const card = div("role-card");
  card.style.setProperty("--role-bg", role.theme.bg);
  card.style.setProperty("--role-accent", role.theme.accent);
  card.style.setProperty("--role-glow", role.theme.glow);

  const spriteBox = div("role-sprite");
  spriteBox.appendChild(renderRoleSprite(role.id, 8));

  const lead = h("p", { class: "role-lead", text: "あなたの役職は……" });
  const nameEl = h("p", { class: "role-name", text: `【 ${role.name} 】` });
  const abilityEl = h("p", { class: "role-ability", text: role.ability });
  card.append(lead, spriteBox, nameEl, abilityEl);
  if (role.caution) {
    card.appendChild(h("p", { class: "role-caution", text: `⚠ ${role.caution}` }));
  }

  const menuSlot = div("menu-slot");

  // タイムライン（役職非依存）
  const timers: number[] = [];
  timers.push(window.setTimeout(() => {
    chest.classList.add("is-open");
    sfx.reveal();
  }, T_OPEN));
  timers.push(window.setTimeout(() => {
    stage.classList.add("is-dimmed");
    card.classList.add("is-shown");
    root.appendChild(card);
    root.appendChild(menuSlot);
    menuSlot.appendChild(
      commandMenu([{ label: "役職を確認した", onSelect: onConfirm }]),
    );
  }, T_CARD));

  function onConfirm(): void {
    timers.forEach((t) => window.clearTimeout(t));

    // 役職情報を表示状態から破棄（カードを裏返して消す）
    card.classList.add("is-flipping");
    menuSlot.replaceChildren();

    window.setTimeout(() => {
      // DOM から役職情報を完全に除去
      card.replaceChildren();
      card.remove();

      confirmCurrentPlayer();

      const memo = messageWindow("役職を記憶した！\n正体は誰にも教えてはいけない……。");
      root.appendChild(memo.el);

      window.setTimeout(() => {
        if (isAllConfirmed()) navigate("allConfirmed");
        else navigate("handoff");
      }, 1400);
    }, 500);
  }

  return root;
}
