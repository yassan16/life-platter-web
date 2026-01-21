'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <svg
          className="w-16 h-16 mx-auto text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {error.message || '予期せぬエラーが発生しました'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium transition-all hover:bg-orange-600 active:scale-95"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
