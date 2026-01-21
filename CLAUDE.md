# プロジェクト名
life_platter-web

## WHY（目的）
料理の自炊サポートを中心とした生活支援アプリ「life_platter」のフロントエンド。料理記録の管理、食材管理、レシピ管理機能を提供する。

## WHAT（技術スタック）
- 言語: TypeScript 5
- フレームワーク: Next.js 16.1.1 (App Router), React 19.2.3
- スタイリング: Tailwind CSS 4
- アニメーション: lottie-react
- デプロイ: Vercel

## HOW（開発ガイドライン）
### コマンド
- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番ビルド
- `npm run lint` - ESLint実行

### ディレクトリ構造
- `src/app/` - App Routerページ・レイアウト
- `src/app/components/` - UIコンポーネント
- `src/app/data/` - データ定義・モック
- `public/` - 静的アセット
- `docs/` - ドキュメント

### ドキュメント
- Mermaidでフローチャートやシーケンス図を活用

## 機能モジュールの責務
| ファイル | 責務 |
| -------- | ---- |
| `src/app/layout.tsx` | ルートレイアウト・共通設定 |
| `src/app/page.tsx` | トップページ（料理カレンダー表示） |
| `src/app/components/RecipeCalendar.tsx` | 料理カレンダーUI |
| `src/app/data/mockMeals.ts` | 食事データ定義・モック |
