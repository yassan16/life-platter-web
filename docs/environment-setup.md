# 環境設定ガイド

## 概要

このドキュメントでは、life_platter-web の環境変数設定について説明します。Next.js の環境変数ファイル機能を活用し、開発環境と本番環境で自動的に適切な API エンドポイントへ接続します。

## 目次

- [環境変数ファイルの役割](#環境変数ファイルの役割)
- [CORS回避の仕組み](#cors回避の仕組み)
- [環境変数一覧](#環境変数一覧)
- [クイックスタート](#クイックスタート)
- [動作確認手順](#動作確認手順)
- [トラブルシューティング](#トラブルシューティング)

---

## 環境変数ファイルの役割

| ファイル | Git管理 | 用途 | 適用タイミング |
|----------|---------|------|----------------|
| `.env.development` | ✅ 管理対象 | 開発環境デフォルト（ローカルAPI） | `npm run dev` 時 |
| `.env.production` | ✅ 管理対象 | 本番環境デフォルト（CloudFront） | `npm run build` 時 |
| `.env.local` | ❌ 管理外 | 個人設定（上記を上書き） | 常に最優先 |
| `.env.local.example` | ✅ 管理対象 | `.env.local` のテンプレート | - |

### 優先順位

```
.env.local > .env.development / .env.production > デフォルト値
```

---

## CORS回避の仕組み

### 問題

ブラウザから異なるオリジン（ポート番号が異なる場合も含む）へ直接リクエストするとCORSエラーが発生します。

```
❌ ブラウザ (localhost:3000) → 直接リクエスト → Nginx (localhost:80)
   → CORSエラー（異なるポート = 異なるオリジン）
```

### 解決策：Next.js rewrites によるプロキシ

クライアントサイドは**相対パス**でリクエストし、Next.js の rewrites 機能でバックエンドAPIにプロキシします。

```
✅ ブラウザ (localhost:3000)
   ↓ fetch('/api/...') ← 相対パス（同一オリジン）
   Next.js Dev Server (localhost:3000)
   ↓ rewrites でプロキシ（サーバーサイド、CORSなし）
   Nginx (localhost:80) → FastAPI (localhost:8000)
```

### 設定

| 設定項目 | 開発環境 | 本番環境 |
|----------|----------|----------|
| `NEXT_PUBLIC_API_URL` | 空文字（相対パス使用） | 空文字（相対パス使用） |
| rewrites | `next.config.ts` で設定 | Vercel で自動適用 |

rewrites の設定は `next.config.ts` を参照してください。

---

## 環境変数一覧

| 変数名 | 説明 | 開発デフォルト | 本番デフォルト |
|--------|------|----------------|----------------|
| `NEXT_PUBLIC_API_URL` | API エンドポイントの URL（クライアントサイド） | 空文字（相対パス） | 空文字（相対パス） |
| `API_REWRITE_DESTINATION` | rewrites先のURL（サーバーサイド専用） | `http://localhost` | `https://dm1vi7xjicrqg.cloudfront.net` |
| `NEXT_PUBLIC_IMAGE_HOST` | 画像配信ホスト名 | `localhost` | `dm1vi7xjicrqg.cloudfront.net` |

---

## クイックスタート

### ローカル開発（ローカルAPI接続）

```bash
# 1. バックエンドAPIを起動（別リポジトリ）
cd docker-projects/projects/life_platter-api
docker compose up -d

# 2. フロントエンド開発サーバーを起動
npm run dev
```

`.env.development` が自動適用され、相対パス経由で `localhost` のAPIに接続します。

### 開発中に本番APIへ接続

```bash
# 1. テンプレートをコピー
cp .env.local.example .env.local

# 2. .env.local を編集し、本番URL行のコメントを解除
NEXT_PUBLIC_API_URL=https://dm1vi7xjicrqg.cloudfront.net
NEXT_PUBLIC_IMAGE_HOST=dm1vi7xjicrqg.cloudfront.net

# 3. 開発サーバーを再起動
npm run dev
```

---

## 動作確認手順

### 1. API接続先の確認

1. `npm run dev` でサーバーを起動
2. ブラウザで `http://localhost:3000` を開く
3. 開発者ツール → Network タブを開く
4. API リクエストの URL を確認:
   - 相対パス使用時: `http://localhost:3000/api/...`（Next.js rewrites 経由）
   - `.env.local` で本番URL設定時: `https://dm1vi7xjicrqg.cloudfront.net/api/...`

### 2. 画像読み込みの確認

1. 料理一覧ページを開く
2. 画像が正常に表示されることを確認
3. 開発者ツールで画像の読み込み元を確認

### 3. ビルド確認

```bash
npm run build
# エラーなく完了することを確認
```

---

## トラブルシューティング

### API接続エラー

| 症状 | 原因 | 対処法 |
|------|------|--------|
| `ECONNREFUSED` | ローカルAPIが起動していない | `docker compose up -d` でAPIを起動 |
| `CORS error` | 絶対URLでAPIを呼び出している | `NEXT_PUBLIC_API_URL` が空文字であることを確認（[CORS回避の仕組み](#cors回避の仕組み)参照） |
| `404 Not Found` | API パスの誤り | ネットワークタブでリクエストURLを確認 |

### 画像が表示されない

| 症状 | 原因 | 対処法 |
|------|------|--------|
| 画像が壊れて表示 | `NEXT_PUBLIC_IMAGE_HOST` が未設定 | 環境変数を確認 |
| 403 エラー | CloudFront の設定不備 | CloudFront の設定を確認 |

### 環境変数が反映されない

1. 開発サーバーを再起動（`Ctrl+C` → `npm run dev`）
2. `.next` フォルダを削除して再ビルド:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## 関連ドキュメント

- [アーキテクチャ](./architecture.md)
- [機能モジュール](./modules.md)
