// ===== ドット絵スプライト・レンダラ =====
// スプライトは「データ」として定義し、canvas に 1セル=1ピクセルで描画 → CSS で拡大。
// 外部画像アセットを持たないので、URL/ファイル名に役職名が漏れる経路が原理的に存在しない。
// 対称なスプライトは左半分(8px)だけ定義し、コードで左右ミラーする（作画ミスと非対称を防ぐ）。

import type { RoleId } from "./types";
import { ROLES } from "./roles";

type Palette = Record<string, string>;

/** 左半分(8列×16行)を左右ミラーして 16×16 の全体マトリクスにする。 */
function mirror(leftHalf: string[]): string[] {
  return leftHalf.map((row) => {
    const rev = row.split("").reverse().join("");
    return row + rev;
  });
}

// ---- ベース猫（毛色を差し替え可能。役職とは無関係に再彩色できる） ----
const CAT_LEFT = [
  "........",
  "...OO...",
  "..OFFO..",
  "..OFFFO.",
  ".OFFFFFO",
  ".OFFFFFF",
  ".OFFEFFF",
  ".OFFEFFF",
  ".OFFFFFF",
  ".OFFFFFN",
  ".OFFFFFF",
  ".OFFFFFF",
  "..OFFFFF",
  "..OFFFFF",
  "..OFFFFF",
  "...OOO..",
];
const CAT = mirror(CAT_LEFT);

// ---- 役職アクセサリ（ベース猫の上に重ねる。'M' = 役職パレットのアクセント色） ----
const ACCESSORY: Record<string, string[]> = {
  mantle: mirror([
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "M.......",
    "M.......",
    "M.......",
    "MM......",
    "MM......",
    "MM......",
    "M.......",
  ]),
  shield: mirror([
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "......MM",
    "......MM",
    "......MM",
    "......MM",
    ".......M",
    "........",
  ]),
  kerchief: mirror([
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "......MM",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
  ]),
  hood: mirror([
    "........",
    "...MM...",
    "..MMMM..",
    ".MMMMMM.",
    "MMMMMMMM",
    "MMM.....",
    "MM......",
    "M.......",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
  ]),
  detective: mirror([
    "...MM...",
    "..MMMM..",
    ".MMMMMM.",
    "..MMMM..",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
    "........",
  ]),
};

// ---- 「あるちゅーる」アイテム（ジョッキ）。タイトル/受付/場に登場 ----
const MUG_LEFT = [
  "........",
  ".OOOOOO.",
  ".OWWWWO.",
  ".OWWWWO.",
  ".OAAAAO.",
  ".OAAAAO.",
  ".OAAAAO.",
  ".OAAAAO.",
  ".OAAAAO.",
  ".OAAAAO.",
  ".OOOOOO.",
  "..OOOO..",
  "........",
  "........",
  "........",
  "........",
];
const MUG = mirror(MUG_LEFT);

const DEFAULT_OUTLINE = "#140f1e";

function drawMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  palette: Palette,
): void {
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    for (let x = 0; x < row.length; x++) {
      const code = row[x];
      if (code === "." || code === undefined) continue;
      const color = palette[code];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function makeCanvas(size = 16, scale = 6): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const displayPx = size * scale;
  canvas.style.width = `${displayPx}px`;
  canvas.style.height = `${displayPx}px`;
  canvas.style.imageRendering = "pixelated";
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

/** 16進色を暗くする（毛色の陰影 'f' を自動生成）。 */
function shade(hex: string, factor = 0.72): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const num = parseInt(m[1], 16);
  const r = Math.round(((num >> 16) & 0xff) * factor);
  const g = Math.round(((num >> 8) & 0xff) * factor);
  const b = Math.round((num & 0xff) * factor);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** 毛色から作る汎用猫（受付・集合シーン用。役職と無関係）。 */
export function renderCat(furColor: string, scale = 6): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas(16, scale);
  drawMatrix(ctx, CAT, {
    O: DEFAULT_OUTLINE,
    F: furColor,
    f: shade(furColor),
    E: "#241c2c",
    N: "#3a2630",
  });
  return canvas;
}

/**
 * 役職スプライト（役職確認画面でのみ使用）。
 * ベース猫＋役職パレット＋アクセサリ装飾を重ねる。
 */
export function renderRoleSprite(roleId: RoleId, scale = 7): HTMLCanvasElement {
  const def = ROLES[roleId];
  const { canvas, ctx } = makeCanvas(16, scale);
  drawMatrix(ctx, CAT, { O: DEFAULT_OUTLINE, ...def.palette });
  if (def.accessory !== "none") {
    drawMatrix(ctx, ACCESSORY[def.accessory], { M: def.palette.M });
  }
  return canvas;
}

/** 「あるちゅーる」ジョッキ。 */
export function renderMug(scale = 6): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas(16, scale);
  drawMatrix(ctx, MUG, {
    O: DEFAULT_OUTLINE,
    W: "#f2ead2",
    A: "#d99a2b",
  });
  return canvas;
}
