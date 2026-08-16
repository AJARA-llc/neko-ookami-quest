import type { GameMode, GameState, RoleId, Screen } from "./types";
import { clampPlayers, composeRoles, MIN_PLAYERS } from "./roles";

// ===== ゲーム状態ストア =====
// 状態はモジュール内クロージャに閉じ込める。localStorage / URL には一切書かない。
// これ自体が「役職秘匿」の一次防衛線。

/** 受付・集合シーンで使う毛色プール（役職とは無関係のランダム）。 */
const FUR_PALETTE = [
  "#e8b45a", // 茶トラ
  "#d9d2c5", // 白
  "#4a4a52", // 黒
  "#a9805a", // キジ
  "#c9c2b6", // グレー
  "#e0a87e", // クリーム
  "#8a6f52", // こげ茶
  "#b0b7bd", // 青灰
];

function freshState(): GameState {
  return {
    screen: "title",
    mode: "standard",
    playerCount: 5,
    names: [],
    roles: [],
    furColors: [],
    currentPlayerIndex: 0,
    confirmedCount: 0,
    soundEnabled: false, // 既定 OFF（事前選択制）
  };
}

let state: GameState = freshState();

// ---- 読み取り ----
export const getState = (): Readonly<GameState> => state;

/**
 * 今スマホを持つプレイヤーの役職。
 * **本人確認済みのシーケンス中のみ** 呼び出してよい。呼び出し側の責務。
 */
export function currentRole(): RoleId {
  return state.roles[state.currentPlayerIndex];
}

export function currentName(): string {
  return state.names[state.currentPlayerIndex] ?? `冒険者${state.currentPlayerIndex + 1}`;
}

export function isAllConfirmed(): boolean {
  return state.confirmedCount >= state.playerCount;
}

// ---- 更新 ----
export function setScreen(screen: Screen): void {
  state.screen = screen;
}

export function setPlayerCount(n: number): void {
  state.playerCount = clampPlayers(n);
}

/** あそびかた（役職構成モード）を確定。 */
export function setMode(mode: GameMode): void {
  state.mode = mode;
}

/**
 * 名前入力を確定。**実際に入力されたなまえの数**を参加人数の唯一の真実とする。
 * 事前の人数選択より優先。空欄は参加者として数えない
 *   → 4人ぶんだけ入力すれば役職も4人ぶんになる（operator確定の挙動）。
 * 入力が MIN_PLAYERS 未満で呼ばれることは呼び出し側（names画面）が防ぐ。
 */
export function setNames(rawNames: string[]): void {
  const names = rawNames.map((nm) => (nm ?? "").trim()).filter((nm) => nm.length > 0);
  const furColors = names.map(() => randomFur());
  state.playerCount = names.length;
  state.names = names;
  state.furColors = furColors;
}

/** 役職抽選を実行（秘匿。ここで初めて roles が埋まる）。 */
export function drawRoles(): void {
  state.roles = composeRoles(state.playerCount, state.mode);
  state.currentPlayerIndex = 0;
  state.confirmedCount = 0;
}

/** 現在のプレイヤーが役職を確認し終えた — 確認済みに進める。 */
export function confirmCurrentPlayer(): void {
  state.confirmedCount = Math.min(state.playerCount, state.confirmedCount + 1);
  if (state.currentPlayerIndex < state.playerCount - 1) {
    state.currentPlayerIndex += 1;
  }
}

export function toggleSound(): boolean {
  state.soundEnabled = !state.soundEnabled;
  return state.soundEnabled;
}

/** タイトルへ戻る＝完全リセット（役職情報を残さない）。 */
export function resetGame(): void {
  state = freshState();
}

function randomFur(): string {
  return FUR_PALETTE[Math.floor(Math.random() * FUR_PALETTE.length)];
}

export { MIN_PLAYERS };
