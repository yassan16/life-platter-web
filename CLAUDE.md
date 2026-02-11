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

### SuperClaude・skillsの使用

- アウトプットの精度を向上させるため、以下のスキルを必ず使用してください
  - /skills
  - **SuperClaude**
  - **vercel-react-best-practices**
  - **web-design-guidelines**

### ドキュメント作成

- ファイルの作成・変更時は関連する`README.md` を更新してください。

### 図表の使い分け

Mermaid記法を使い、以下のように使い分けてください。

| 図表              | 用途                       |
| ----------------- | -------------------------- |
| `erDiagram`       | テーブル関係・カラム定義   |
| `sequenceDiagram` | API呼び出し・処理フロー    |
| `flowchart`       | 判定ロジック・状態遷移     |
| Markdownテーブル  | カラム説明・ステータス一覧 |

### ドキュメント構造

- 概要、目次、以降に詳細説明を追記すること
- #, ##, ### 見出しを適切に使い分け、必ず階層構造を守り、目次のリンクを貼ること

### ドキュメント
  
- 詳細なアーキテクチャ: [docs/architecture.md](docs/architecture.md)
- 機能モジュール責務: [docs/modules.md](docs/modules.md)
- ビルドフロー: [docs/build-flow.md](docs/build-flow.md)
