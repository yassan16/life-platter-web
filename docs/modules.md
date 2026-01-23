# 機能モジュール責務

## ページ・レイアウト

| ファイル | 責務 |
|---------|------|
| `src/app/layout.tsx` | ルートレイアウト・メタデータ設定 |
| `src/app/page.tsx` | トップページ（/calendar へリダイレクト） |
| `src/app/(app)/layout.tsx` | アプリケーションレイアウト（認証チェック） |
| `src/app/(app)/calendar/page.tsx` | 月間カレンダーページ |
| `src/app/(app)/dishes/page.tsx` | 料理一覧ページ |
| `src/app/(app)/add/page.tsx` | 料理追加ページ |

## コンポーネント

### features/calendar

| ファイル | 責務 |
|---------|------|
| `src/components/features/calendar/MonthCalendar.tsx` | 月間カレンダー UI |

### features/dishes

| ファイル | 責務 |
|---------|------|
| `src/components/features/dishes/DishList.tsx` | 無限スクロール料理リスト |
| `src/components/features/dishes/DishForm.tsx` | 料理登録フォーム |
| `src/components/features/dishes/DishCard.tsx` | 料理カード |
| `src/components/features/dishes/DishDetailModal.tsx` | 料理詳細モーダル |

### features/auth

| ファイル | 責務 |
|---------|------|
| `src/components/features/auth/LoginForm.tsx` | ログインフォーム |

### layout

| ファイル | 責務 |
|---------|------|
| `src/components/layout/Header.tsx` | ヘッダー |
| `src/components/layout/TabNavigation.tsx` | ボトムナビゲーション |

### ui

| ファイル | 責務 |
|---------|------|
| `src/components/ui/Button.tsx` | ボタン |
| `src/components/ui/Modal.tsx` | モーダル |

## API・状態管理

| ファイル | 責務 |
|---------|------|
| `src/lib/api/client.ts` | HTTP クライアント基盤 |
| `src/lib/api/auth.ts` | 認証 API |
| `src/lib/api/dishes.ts` | 料理 API |
| `src/stores/authStore.ts` | 認証状態管理（Zustand） |
| `src/lib/hooks/useDishes.ts` | 料理データフック |

## 型定義

| ファイル | 責務 |
|---------|------|
| `src/types/auth.ts` | 認証関連型定義 |
| `src/types/dish.ts` | 料理関連型定義 |
