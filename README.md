# あるちゅーるQUEST 〜猫狼たちの宴〜

ドット絵RPG風・スマホ受け渡し式の役職抽選パーティーゲーム。
1台のスマホを回して各プレイヤーが自分の役職をこっそり確認する、完全ローカル完結のWebアプリ（クライアント商材: 株式会社エピック「あるちゅーる」）。

## 特徴

- **完全クライアント完結**: バックエンド・DB・通信なし。1台のスマホで完結。
- **ドット絵RPG演出**: 夜の酒場・宝箱・運命の扉・タイプライター会話・RPGコマンドメニュー。
- **役職秘匿を最優先**: タイミング・画面色・ファイル名・効果音・毛色のいずれからも役職が漏れない設計（`docs/flows/architecture.md` の「秘匿保証」参照）。
- **9:16 レスポンシブ**: 320px幅端末でも崩れない。片手操作、主要ボタンは下部。
- **8bitサウンド**: Web Audio生成（音声ファイル不要）。既定OFF・事前選択制。

## 役職（標準構成）

| 人数 | 猫狼 | ニャーロックホームズ | 猫ババ | 鋼の意志 | 野良猫 |
|---|---|---|---|---|---|
| 3 | 1 | - | - | - | 2 |
| 4 | 1 | 1 | - | - | 2 |
| 5 | 1 | 1 | 1 | - | 2 |
| 6-7 | 1 | 1 | 1 | 1 | 残り |
| 8-12 | 2 | 1 | 1 | 1 | 残り |

構成は `src/roles.ts` の `composeRoles()` 1箇所で定義（single source of truth）。変更はここだけ。

## ゲームの流れ

1. 役職フェイズ: スマホを回して各自が役職をこっそり確認
2. アクションフェイズ: もう一度スマホを回して各自がアクションカードを引く
   - 各プレイヤーは「見せてよい行動」を1枚引く（猫狼の『あーん』はこの中に紛れる）
   - 猫狼・猫ババには本人だけに秘匿タスクを表示
   - ニャーロックホームズは1人選んで相手のアクションカードだけを覗ける（役職は見えない）
3. クエスト: 配られたカードの指示を実行しながら、宴に潜む猫狼を当てる

アクションカードのデッキは `src/actions.ts` の `ACTION_DECK` 1箇所で定義。差し替え・増減はここだけ。

## 開発

```bash
npm install
npm run dev        # http://localhost:3020
npm run build      # dist/ に静的出力
npm run preview    # ビルド結果をローカル確認
npm run typecheck  # 型チェック
```

## デプロイ

静的サイト。`npm run build` の `dist/` をそのままホスティング（Cloudflare Pages 等）。

```bash
# 例: Cloudflare Pages
npx wrangler pages deploy dist --project-name neko-ookami-quest
```

## 構成

```
src/
  main.ts              エントリ（トップバー＋ルーター起動）
  types.ts             型定義（役職・状態）
  roles.ts             役職定義＋人数別構成ロジック
  actions.ts           アクションカードのデッキ＋特殊役職の秘匿タスク
  state.ts             ゲーム状態ストア（役職秘匿の一次防衛線）
  router.ts            画面状態機械
  pixel.ts             ドット絵スプライト・レンダラ（canvas生成・画像アセット不使用）
  sfx.ts               8bit効果音（Web Audio）
  dom.ts               最小DOMヘルパー（innerHTML不使用＝XSS経路ゼロ）
  components/          会話ウィンドウ・コマンドメニュー・音声トグル
  screens/             10画面（title→count→names→draw→[handoff→identity→reveal]→allConfirmed→[handoff→identity→actionDraw]→quest）
  styles/              tokens / base / pixel / screens
docs/flows/architecture.md   アーキテクチャ＋秘匿保証
```
