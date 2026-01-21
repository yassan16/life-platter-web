'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const tabs = [
  {
    href: '/calendar',
    label: 'カレンダー',
    icon: (active: boolean) => (
      <svg
        className={clsx('w-6 h-6', active ? 'text-orange-500' : 'text-gray-400')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: '/add',
    label: '料理追加',
    icon: (active: boolean) => (
      <svg
        className={clsx('w-6 h-6', active ? 'text-orange-500' : 'text-gray-400')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: '/dishes',
    label: '料理一覧',
    icon: (active: boolean) => (
      <svg
        className={clsx('w-6 h-6', active ? 'text-orange-500' : 'text-gray-400')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
  },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full',
                'transition-all active:scale-95'
              )}
            >
              {tab.icon(isActive)}
              <span
                className={clsx(
                  'text-xs mt-1',
                  isActive ? 'text-orange-500 font-medium' : 'text-gray-400'
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
