'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: 'danger' | 'default';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const firstButton = dialogRef.current?.querySelector<HTMLElement>('button');
      firstButton?.focus();
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (!isOpen && previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div
        className="absolute inset-0 bg-black/50 motion-safe:animate-fade-in"
        onClick={onClose}
        role="presentation"
      />
      <div
        ref={dialogRef}
        className="relative bg-white rounded-2xl p-6 mx-4 max-w-sm w-full motion-safe:animate-fade-in"
      >
        <h3
          id="confirm-dialog-title"
          className="text-lg font-bold text-gray-900 mb-2"
        >
          {title}
        </h3>
        <p
          id="confirm-dialog-message"
          className="text-sm text-gray-600 mb-6"
        >
          {message}
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className={`flex-1 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
