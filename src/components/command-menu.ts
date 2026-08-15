// ===== RPGコマンドメニュー（▶カーソル＋枠内全体タップ＋沈み込み＋決定音） =====

import { sfx } from "../sfx";

export interface Command {
  label: string;
  onSelect: () => void;
  /** true のときキャンセル音（「もどる」等） */
  cancel?: boolean;
}

/**
 * コマンド選択メニューを生成。
 * - 選択中の項目に ▶ カーソル
 * - 枠内全体がタップ可能（文字だけでなく）
 * - タップで 1〜2px 沈む → 決定音 → onSelect
 * - 上下キー / Enter でも操作可（PC・アクセシビリティ）
 */
export function commandMenu(commands: Command[]): HTMLElement {
  const menu = document.createElement("div");
  menu.className = "cmd-menu";
  menu.setAttribute("role", "menu");

  let activeIndex = 0;
  const items: HTMLButtonElement[] = [];

  function setActive(i: number): void {
    activeIndex = (i + commands.length) % commands.length;
    items.forEach((btn, n) => {
      btn.classList.toggle("is-active", n === activeIndex);
      btn.setAttribute("aria-selected", n === activeIndex ? "true" : "false");
    });
  }

  function fire(i: number): void {
    const cmd = commands[i];
    if (cmd.cancel) sfx.cancel();
    else sfx.decide();
    cmd.onSelect();
  }

  commands.forEach((cmd, i) => {
    const btn = document.createElement("button");
    btn.className = "cmd-item";
    btn.type = "button";
    btn.setAttribute("role", "menuitem");

    const cursor = document.createElement("span");
    cursor.className = "cmd-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.textContent = "▶";

    const label = document.createElement("span");
    label.className = "cmd-label";
    label.textContent = cmd.label;

    btn.append(cursor, label);
    btn.addEventListener("pointerenter", () => setActive(i));
    btn.addEventListener("click", () => {
      setActive(i);
      fire(i);
    });

    items.push(btn);
    menu.appendChild(btn);
  });

  menu.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex + 1);
      sfx.cursor();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex - 1);
      sfx.cursor();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fire(activeIndex);
    }
  });

  setActive(0);
  return menu;
}
