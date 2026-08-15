// ===== 14. ゲーム進行表示（クエスト画面） =====
// 表示してよい: 参加人数 / ゲーム状態 / 簡単なルール / 終了ボタン
// 表示しない: 役職一覧・役職ごとの人数・誰にどの役職が割り当てられたか（秘匿）

import { navigate } from "../router";
import { getState, resetGame } from "../state";
import { commandMenu } from "../components/command-menu";
import { h, div } from "../dom";

export function questScreen(): HTMLElement {
  const root = div("scene scene--quest");
  const { playerCount } = getState();

  const header = div(
    "quest-header",
    h("p", { class: "quest-label", text: "QUEST" }),
    h("p", { class: "quest-headline", text: "宴に潜む猫狼を見つけろ！" }),
  );

  const mission = div(
    "quest-card",
    h("p", { class: "quest-card-label", text: "MISSION" }),
    h("p", { class: "quest-card-body", text: "アクションカードの指示に従え" }),
  );

  const info = div(
    "quest-info",
    infoRow("参加人数", `${playerCount} びき`),
    infoRow("状態", "宴のさなか"),
  );

  const rules = div(
    "quest-rules",
    h("p", { class: "quest-rules-title", text: "あそびかた" }),
    ruleLine("① 配られたアクションカードの指示を実行する"),
    ruleLine("② 猫狼はこっそり だれかに「あーん」する"),
    ruleLine("③ 話し合って、宴に潜む猫狼を当てよう"),
  );

  const menu = commandMenu([
    {
      label: "ゲームを終了する",
      cancel: true,
      onSelect: () => {
        resetGame();
        navigate("title");
      },
    },
  ]);

  root.append(header, mission, info, rules, menu);
  return root;
}

function infoRow(label: string, value: string): HTMLElement {
  return div(
    "quest-info-row",
    h("span", { class: "quest-info-key", text: label }),
    h("span", { class: "quest-info-val", text: value }),
  );
}

function ruleLine(text: string): HTMLElement {
  return h("p", { class: "quest-rule-line", text });
}
