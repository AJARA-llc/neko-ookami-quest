import type { GameState, RoleId, Screen } from "./types";
import { clampPlayers, composeRoles, MIN_PLAYERS } from "./roles";
import { drawActionCards } from "./actions";

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
    phase: "role",
    playerCount: 5,
    names: [],
    roles: [],
    furColors: [],
    actionCards: [],
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

/** 今スマホを持つプレイヤーのアクションカード（アクションフェイズ中のみ）。 */
export function currentActionCard(): string {
  return state.actionCards[state.currentPlayerIndex] ?? "";
}

/** 指定プレイヤーのアクションカード（ホームズの覗き用）。 */
export function actionCardOf(index: number): string {
  return state.actionCards[index] ?? "";
}

/** 今のプレイヤー以外の一覧（ホームズの覗き対象選択用）。 */
export function otherPlayers(): { index: number; name: string }[] {
  const list: { index: number; name: string }[] = [];
  for (let i = 0; i < state.playerCount; i++) {
    if (i === state.currentPlayerIndex) continue;
    list.push({ index: i, name: state.names[i] ?? `冒険者${i + 1}` });
  }
  return list;
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

/** 名前入力を確定。空欄は「冒険者NN」で補完する。 */
export function setNames(rawNames: string[]): void {
  const n = state.playerCount;
  const names: string[] = [];
  const furColors: string[] = [];
  for (let i = 0; i < n; i++) {
    const nm = (rawNames[i] ?? "").trim();
    names.push(nm.length > 0 ? nm : `冒険者${String(i + 1).padStart(2, "0")}`);
    furColors.push(randomFur());
  }
  state.names = names;
  state.furColors = furColors;
}

/** 役職抽選を実行（秘匿。ここで初めて roles が埋まる）。 */
export function drawRoles(): void {
  state.roles = composeRoles(state.playerCount);
  state.currentPlayerIndex = 0;
  state.confirmedCount = 0;
}

/** アクションフェイズを開始（カードを配り、受け渡しシーケンスを頭出し）。 */
export function startActionPhase(): void {
  state.phase = "action";
  state.actionCards = drawActionCards(state.playerCount);
  state.currentPlayerIndex = 0;
  state.confirmedCount = 0;
}

/** 現在のプレイヤーが確認を終えた（役職／アクション共通）— 確認済みに進める。 */
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
