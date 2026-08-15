import type { RoleId } from "./types";

// ===== アクションカード（宴向けデッキ・おまかせ設計） =====
// 誰もが1枚引く「見せてよい行動」＝カバー。猫狼の『あーん』はこの中に紛れる。
// デッキはここ1箇所で定義（single source of truth）。差し替え・増減はこの配列のみ。

export const ACTION_DECK: string[] = [
  "となりの人と 乾杯する",
  "あるちゅーるを ひとくち飲む",
  "好きな人に「あーん」する", // ← 猫狼の行動がここに紛れる
  "3びょうで 猫のモノマネ",
  "となりの人に 猫のものまねを してもらう",
  "いちばん右の人を ほめる",
  "両どなりと 猫の手で ハイタッチ",
  "好きな人と 目を合わせて 3びょう「ニャー」",
  "場のあるちゅーるの 感想を ひとこと言う",
  "好きな人に そっと 猫パンチの まね",
  "好きな人に「あーん」する ふりだけ", // ← あいまいさを生むもう1枚
  "5びょう だまって みんなを 見わたす",
];

/**
 * 特殊役職の秘匿タスク（アクションカードとは別に、本人だけに表示する任務）。
 * 猫狼・猫ババはカバーのカードを1枚引きつつ、この任務も課される。
 */
export const SECRET_TASK: Partial<Record<RoleId, string>> = {
  neko_ookami: "【猫狼のにんむ】ひいたカードに関係なく、こっそり だれかひとりに「あーん」を仕込め。ぜったいバレるな！",
  nekobaba: "【猫ババのにんむ】アクションのとき、場にある「あるちゅーる」を 食べなければならない。",
};

/** ホームズだけがもつ、他人のカードを覗く導線を示すフラグ。 */
export function canPeek(roleId: RoleId): boolean {
  return roleId === "holmes";
}

/** 各プレイヤーに1枚ずつ配る（重複可＝実際にデッキから引く感覚）。 */
export function drawActionCards(count: number): string[] {
  const cards: string[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(ACTION_DECK[Math.floor(Math.random() * ACTION_DECK.length)]);
  }
  return cards;
}
