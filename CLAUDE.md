# プロジェクト名
life_platter-web

## WHY（目的）
料理の自炊サポートを中心とした生活支援アプリ「life_platter」のフロントエンド。料理記録の管理、食材管理、レシピ管理機能を提供する。

## WHAT（技術スタック）
- 言語: TypeScript 5
- フレームワーク: Next.js 16.1.1 (App Router), React 19.2.3
- スタイリング: Tailwind CSS 4
- 状態管理: Zustand 5.0.10
- 日付操作: date-fns 4.1.0
- ユーティリティ: clsx 2.1.1, tailwind-merge 3.4.0
- アニメーション: lottie-react
- デプロイ: Vercel

## HOW（開発ガイドライン）
### コマンド
- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番ビルド
- `npm run lint` - ESLint実行

### ドキュメント
- Mermaidでフローチャートやシーケンス図を活用
- 詳細なアーキテクチャ: [docs/architecture.md](docs/architecture.md)
- 機能モジュール責務: [docs/modules.md](docs/modules.md)
