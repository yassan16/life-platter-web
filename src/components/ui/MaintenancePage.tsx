'use client';

import { useEffect } from 'react';

export function MaintenancePage() {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function check() {
      fetch('/api/health', { method: 'HEAD', cache: 'no-store' })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          timeoutId = setTimeout(check, 30000);
        });
    }

    timeoutId = setTimeout(check, 30000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="メンテナンス中"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center p-4 pb-safe pt-safe bg-gradient-to-b from-orange-50 to-white motion-safe:animate-fade-in"
    >
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Life Platter</h1>
          <p className="text-gray-600 mt-2 text-sm">料理の自炊サポートアプリ</p>
        </div>

        {/* カード */}
        <div className="bg-white rounded-2xl shadow-lg px-6 py-8 text-center">
          {/* アイコン */}
          <svg
            className="w-16 h-16 mx-auto mb-6 text-orange-500 motion-safe:animate-spin motion-safe:[animation-duration:3s]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
            />
          </svg>

          <h2 className="text-xl font-bold text-gray-900 mb-3">メンテナンス中です</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            現在システムのメンテナンスを行っています。
            <br />
            しばらくお待ちください。
          </p>

          {/* ステータス */}
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center gap-2 text-xs text-gray-400"
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-orange-500 motion-safe:animate-spin flex-shrink-0"
              aria-hidden="true"
            />
            <span>自動的に復旧を確認しています...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
