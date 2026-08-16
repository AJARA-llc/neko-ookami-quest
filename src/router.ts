// ===== 画面ルーター（単一状態機械の描画切り替え） =====
// #app の中身を差し替えるだけ。履歴/URL は使わない
//   → ブラウザバックで前の役職が復元される経路を作らない（秘匿）。

import type { Screen } from "./types";
import { getState, setScreen } from "./state";

import { titleScreen } from "./screens/title";
import { modeScreen } from "./screens/mode";
import { countScreen } from "./screens/count";
import { namesScreen } from "./screens/names";
import { drawScreen } from "./screens/draw";
import { handoffScreen } from "./screens/handoff";
import { identityScreen } from "./screens/identity";
import { revealScreen } from "./screens/reveal";
import { allConfirmedScreen } from "./screens/all-confirmed";
import { questScreen } from "./screens/quest";

const RENDERERS: Record<Screen, () => HTMLElement> = {
  title: titleScreen,
  mode: modeScreen,
  count: countScreen,
  names: namesScreen,
  draw: drawScreen,
  handoff: handoffScreen,
  identity: identityScreen,
  reveal: revealScreen,
  allConfirmed: allConfirmedScreen,
  quest: questScreen,
};

let appRoot: HTMLElement | null = null;

export function mountRouter(root: HTMLElement): void {
  appRoot = root;
  renderCurrent();
}

export function navigate(screen: Screen): void {
  setScreen(screen);
  renderCurrent();
}

function renderCurrent(): void {
  if (!appRoot) return;
  const el = RENDERERS[getState().screen]();
  el.classList.add("screen");
  appRoot.replaceChildren(el);
  // 次画面の先頭へスクロール位置をリセット
  appRoot.scrollTop = 0;
}
