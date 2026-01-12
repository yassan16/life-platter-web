"use client";

import RecipeCalendar from "./components/RecipeCalendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Life Platter
          </h1>
          <p className="text-gray-600">
            今週の献立カレンダー
          </p>
        </header>

        {/* カレンダー */}
        <RecipeCalendar />

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          今日は何を作ろう?
        </footer>
      </div>
    </div>
  );
}
