'use client';

import { useEffect } from 'react';
import { useBottomSheetDrag } from '@/lib/hooks/useBottomSheetDrag';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscape?: () => void;
  children: React.ReactNode;
  height?: string;
  swipeable?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onEscape,
  children,
  height = 'h-[90vh]',
  swipeable = false,
}: ModalProps) {
  const { sheetRef, isDragging, isClosing, sheetStyle, overlayOpacity } =
    useBottomSheetDrag({
      onClose,
      enabled: swipeable && isOpen,
    });

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

  const hasSwipeInteraction = isDragging || isClosing;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div
        className={`absolute inset-0 bg-black/50 ${!hasSwipeInteraction ? 'motion-safe:animate-fade-in' : ''}`}
        style={
          swipeable
            ? {
                opacity: overlayOpacity,
                transition: isClosing ? 'opacity 200ms ease-in' : undefined,
              }
            : undefined
        }
        onClick={isClosing ? undefined : onClose}
        role="presentation"
      />
      <div
        ref={swipeable ? sheetRef : undefined}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl ${!isClosing ? 'motion-safe:animate-slide-up' : ''} ${height} flex flex-col overflow-hidden`}
        style={{
          overscrollBehavior: 'contain',
          touchAction: swipeable ? 'pan-x' : 'manipulation',
          ...(swipeable ? sheetStyle : {}),
        }}
      >
        <div
          className={`flex-shrink-0 flex justify-center pt-3 pb-2 ${swipeable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
