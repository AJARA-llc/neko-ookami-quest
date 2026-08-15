// ===== RPG会話ウィンドウ（タイプライター＋点滅三角＋タップで即時表示） =====

import { sfx } from "../sfx";

export interface MessageWindow {
  /** ウィンドウ要素 */
  el: HTMLElement;
  /** 全文表示が終わったら resolve */
  whenTyped: Promise<void>;
  /** 即時表示（タイプ中断） */
  complete: () => void;
}

const CHAR_MS = 34; // 1文字あたりの表示間隔

/**
 * 会話ウィンドウを生成する。改行は "\n" で表現。
 * タップするとタイプ演出を飛ばして全文即時表示。
 */
export function messageWindow(text: string): MessageWindow {
  const el = document.createElement("div");
  el.className = "msg-window";

  const body = document.createElement("p");
  body.className = "msg-body";
  el.appendChild(body);

  const cursor = document.createElement("span");
  cursor.className = "msg-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "▼";
  el.appendChild(cursor);

  const chars = Array.from(text);
  let idx = 0;
  let done = false;
  let timer: number | undefined;
  let resolveTyped!: () => void;
  const whenTyped = new Promise<void>((res) => (resolveTyped = res));

  function renderUpTo(n: number): void {
    body.textContent = chars.slice(0, n).join("");
  }

  function finish(): void {
    if (done) return;
    done = true;
    if (timer !== undefined) window.clearTimeout(timer);
    renderUpTo(chars.length);
    el.classList.add("is-done");
    resolveTyped();
  }

  function step(): void {
    idx += 1;
    renderUpTo(idx);
    if (idx % 3 === 0) sfx.tick();
    if (idx >= chars.length) {
      finish();
      return;
    }
    timer = window.setTimeout(step, CHAR_MS);
  }

  // タップで即時表示（まだタイプ中のときだけ）
  el.addEventListener("click", (e) => {
    if (!done) {
      e.stopPropagation();
      finish();
    }
  });

  // 開始
  timer = window.setTimeout(step, CHAR_MS);

  return { el, whenTyped, complete: finish };
}
