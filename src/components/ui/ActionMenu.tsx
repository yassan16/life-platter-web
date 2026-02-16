'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ActionMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const handleItemClick = (item: ActionMenuItem) => {
    setIsOpen(false);
    item.onClick();
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
        style={{ touchAction: 'manipulation' }}
        aria-label="メニューを開く"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={close}
            role="presentation"
          />
          <div
            className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px] z-20 motion-safe:animate-fade-in"
            role="menu"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none ${
                  item.variant === 'danger' ? 'text-red-600' : 'text-gray-700'
                }`}
                role="menuitem"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
