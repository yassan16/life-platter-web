'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscape?: () => void;
  children: React.ReactNode;
  height?: string;
}

export function Modal({ isOpen, onClose, onEscape, children, height = 'h-[90vh]' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        (onEscape ?? onClose)();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, onEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/50 motion-safe:animate-fade-in"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl motion-safe:animate-slide-up ${height} flex flex-col overflow-hidden`}
        style={{ overscrollBehavior: 'contain', touchAction: 'manipulation' }}
      >
        <div className="flex-shrink-0 flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
