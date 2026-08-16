import type { GameMode, RoleDef, RoleId } from "./types";

// ===== 役職定義 =====
// テーマ色・パレットは「役職確認画面」でのみ使用する。本人確認前には露出しない。

export const ROLES: Record<RoleId, RoleDef> = {
  neko_ookami: {
    id: "neko_ookami",
    name: "猫狼",
    ability: "正体をかくし、だれかひとりに「あーん」しよう！",
    theme: { bg: "#160a10", accent: "#c62b3f", glow: "#ff3b5c" },
    // 黒〜濃灰の猫 + 赤マント + 赤く光る目
    palette: { F: "#2b2530", f: "#1a1620", E: "#ff2d4a", N: "#0d0a12", M: "#b21f34" },
    accessory: "mantle",
  },
  hagane: {
    id: "hagane",
    name: "鋼の意志",
    ability: "「あーん」されても グル猫にならない！",
    theme: { bg: "#0d1626", accent: "#8fb7e8", glow: "#cfe6ff" },
    // 銀色の鎧を着た猫騎士 + 大きな盾
    palette: { F: "#c9d4e0", f: "#9aa9bd", E: "#2b3a55", N: "#3a4a66", M: "#dfe9f5" },
    accessory: "shield",
  },
  nora: {
    id: "nora",
    name: "野良猫",
    ability: "特別な能力はない。自由に宴を楽しもう！",
    theme: { bg: "#141a10", accent: "#a7c07a", glow: "#d6e6ac" },
    // 素朴な旅の猫（ベージュ）
    palette: { F: "#d8c39a", f: "#b39c72", E: "#3a2e1e", N: "#5a4630", M: "#8a6d47" },
    accessory: "kerchief",
  },
  nekobaba: {
    id: "nekobaba",
    name: "猫ババ",
    ability: "アクション時に、場にある「あるちゅーる」を食べなければならない！",
    theme: { bg: "#150c1e", accent: "#c9a227", glow: "#f2d34a" },
    // 怪盗風の猫 + 紫のフード + 大きな袋
    palette: { F: "#3a2a44", f: "#281c30", E: "#f2d34a", N: "#120c18", M: "#6a3fa0" },
    accessory: "hood",
  },
  holmes: {
    id: "holmes",
    name: "ニャーロックホームズ",
    ability: "好きな人のアクションカードを こっそり見よう！",
    caution: "音を立てないように！",
    theme: { bg: "#0e1220", accent: "#c99b56", glow: "#f2c879" },
    // 探偵帽をかぶった猫 + 虫眼鏡 + 茶コート
    palette: { F: "#6b5136", f: "#4d3a26", E: "#1c2436", N: "#2a2114", M: "#8a5a2b" },
    accessory: "detective",
  },
};

/**
 * 役職構成（operator確定）。ここ 1 箇所を変えれば全体の配分が変わる
 * （config as single source of truth）。あそびかたで 2 モードに分岐する。
 *
 * standard（全役職・人数増で特殊役職が順に登場するバランス型）:
 *   3人 : 猫狼1 / 野良猫2
 *   4人 : 猫狼1 探偵1 / 野良猫2
 *   5人 : 猫狼1 探偵1 猫ババ1 / 野良猫2
 *   6-7人: +鋼の意志1
 *   8人以上: 猫狼2
 *   残りは全て野良猫
 *
 * simple（猫狼と野良猫だけ）:
 *   8人未満: 猫狼1 / 残り野良猫
 *   8人以上: 猫狼2 / 残り野良猫
 */
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;

export function composeRoles(playerCount: number, mode: GameMode = "standard"): RoleId[] {
  const n = clampPlayers(playerCount);
  const roles: RoleId[] = [];

  const wolves = n >= 8 ? 2 : 1;
  for (let i = 0; i < wolves; i++) roles.push("neko_ookami");

  // シンプル版は特殊役職を出さない（猫狼と野良猫だけ）。
  if (mode === "standard") {
    if (n >= 4) roles.push("holmes");
    if (n >= 5) roles.push("nekobaba");
    if (n >= 6) roles.push("hagane");
  }

  while (roles.length < n) roles.push("nora");

  return shuffle(roles);
}

export function clampPlayers(n: number): number {
  if (Number.isNaN(n)) return MIN_PLAYERS;
  return Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, Math.floor(n)));
}

/** Fisher–Yates シャッフル（役職と席順の相関を断つ） */
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
