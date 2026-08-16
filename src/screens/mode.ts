// ===== あそびかた選択画面 =====
// 役職構成モードを選ぶ。おまかせ（全役職）か、猫狼と野良猫だけのシンプル版か。
// ここでは役職の割り当てはまだ行わない（抽選は draw 画面）。

import { navigate } from "../router";
import { setMode } from "../state";
import type { GameMode } from "../types";
import { messageWindow } from "../components/message-window";
import { commandMenu } from "../components/command-menu";
import { h, div } from "../dom";

interface ModeOption {
  mode: GameMode;
  label: string;
  desc: string;
}

const OPTIONS: ModeOption[] = [
  {
    mode: "standard",
    label: "おまかせ",
    desc: "猫狼・探偵・猫ババ・鋼の意志・野良猫。\n人数に応じて役職が増えるバランス型。",
  },
  {
    mode: "simple",
    label: "シンプル",
    desc: "猫狼と野良猫だけ。\nルールかんたん。はじめての宴に。",
  },
];

export function modeScreen(): HTMLElement {
  const root = div("scene scene--mode");

  const msg = messageWindow("あそびかたを えらぶニャ！");
  root.appendChild(msg.el);

  // 2 モードの内容を並べて提示（選ぶ前に中身が分かるように）。
  const cards = div("mode-cards");
  for (const opt of OPTIONS) {
    cards.appendChild(
      div(
        "mode-card",
        h("p", { class: "mode-card-title", text: opt.label }),
        h("p", { class: "mode-card-desc", text: opt.desc }),
      ),
    );
  }
  root.appendChild(cards);

  const menu = commandMenu(
    OPTIONS.map((opt) => ({
      label: `${opt.label}ではじめる`,
      onSelect: () => {
        setMode(opt.mode);
        navigate("count");
      },
    })),
  );
  root.appendChild(menu);

  return root;
}
