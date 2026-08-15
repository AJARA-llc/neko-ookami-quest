// ===== 型定義（Single Source of Truth） =====

/** 役職ID。UI・URL・ファイル名には決して出さない内部識別子。 */
export type RoleId = "neko_ookami" | "hagane" | "nora" | "nekobaba" | "holmes";

/** 画面ステート。ゲームは単一の状態機械として進行する。 */
export type Screen =
  | "title"
  | "count"
  | "names"
  | "draw"
  | "handoff"
  | "identity"
  | "reveal"
  | "allConfirmed"
  | "quest";

/** 役職の静的定義。表示名・能力文・テーマ色・スプライト装飾を持つ。 */
export interface RoleDef {
  id: RoleId;
  /** 表示名（読みやすさ優先。ドットフォントに無理に寄せない） */
  name: string;
  /** 役職確認画面の指示文 */
  ability: string;
  /** 追加注意書き（任意） */
  caution?: string;
  /** テーマ色（役職確認画面でのみ使用。本人確認前には一切露出しない） */
  theme: {
    bg: string;
    accent: string;
    glow: string;
  };
  /** ドット絵パレット（役職スプライト用） */
  palette: Record<string, string>;
  /** 役職スプライトに重ねるアクセサリ装飾の識別子 */
  accessory: "mantle" | "shield" | "kerchief" | "hood" | "detective" | "none";
}

/** ランタイムのゲーム状態。役職割当（roles）は秘匿情報。 */
export interface GameState {
  screen: Screen;
  /** 参加人数。**登録されたなまえの数**で決まる（names が唯一の真実）。 */
  playerCount: number;
  /** プレイヤー名。index が冒険者番号に対応。 */
  names: string[];
  /**
   * 役職割当。names と index 整合。**秘匿情報**。
   * DOM / URL / localStorage には絶対に書き出さない。
   */
  roles: RoleId[];
  /**
   * 各プレイヤーの毛色（受付・集合シーンの見た目）。ランダムで、役職と一切連動しない。
   */
  furColors: string[];
  /** 受け渡し〜確認のシーケンスで「今スマホを持つ人」 */
  currentPlayerIndex: number;
  /** 役職を確認し終えた人数 */
  confirmedCount: number;
  /** 効果音。既定は OFF（周囲に役職が漏れないため & 事前選択制） */
  soundEnabled: boolean;
}
