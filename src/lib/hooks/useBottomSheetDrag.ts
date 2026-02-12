'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

const CLOSE_DISTANCE_THRESHOLD = 100;
const CLOSE_VELOCITY_THRESHOLD = 0.5; // px/ms
const DRAG_START_DISTANCE = 5;
const RESISTANCE_FACTOR = 0.7;
const CLOSE_ANIMATION_MS = 200;
const SNAPBACK_ANIMATION_MS = 300;

type TouchMode = 'pending' | 'drag' | 'scroll';

interface UseBottomSheetDragOptions {
  onClose: () => void;
  enabled: boolean;
}

interface UseBottomSheetDragReturn {
  sheetRef: React.RefCallback<HTMLDivElement>;
  dragOffset: number;
  isDragging: boolean;
  isClosing: boolean;
  sheetStyle: React.CSSProperties;
  overlayOpacity: number;
}

function findScrollableAncestor(
  element: HTMLElement,
  sheetElement: HTMLElement
): HTMLElement | null {
  let current: HTMLElement | null = element;
  while (current && current !== sheetElement) {
    if (current.scrollHeight > current.clientHeight) {
      const style = getComputedStyle(current);
      const overflowY = style.overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return current;
      }
    }
    current = current.parentElement;
  }
  return null;
}

export function useBottomSheetDrag({
  onClose,
  enabled,
}: UseBottomSheetDragOptions): UseBottomSheetDragReturn {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSnappingBack, setIsSnappingBack] = useState(false);

  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const currentYRef = useRef(0);
  const touchModeRef = useRef<TouchMode>('pending');
  const scrollableRef = useRef<HTMLElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragOffset(0);
      setIsDragging(false);
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      startYRef.current = e.touches[0].clientY;
      startTimeRef.current = Date.now();
      currentYRef.current = 0;
      touchModeRef.current = 'pending';

      // Detect the nearest scrollable ancestor from the touch target
      const target = e.target as HTMLElement;
      if (elementRef.current) {
        scrollableRef.current = findScrollableAncestor(
          target,
          elementRef.current
        );
      }
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const deltaY = e.touches[0].clientY - startYRef.current;

      // Already determined as scroll mode — let native scroll handle it
      if (touchModeRef.current === 'scroll') return;

      // Determine mode on first significant movement
      if (touchModeRef.current === 'pending') {
        if (Math.abs(deltaY) < DRAG_START_DISTANCE) return;

        const isDownward = deltaY > 0;
        const scrollContainer = scrollableRef.current;
        const isAtTop = !scrollContainer || scrollContainer.scrollTop <= 0;

        if (isDownward && isAtTop) {
          // Enter drag mode
          touchModeRef.current = 'drag';
          setIsDragging(true);
          e.preventDefault();
        } else {
          // Delegate to native scroll
          touchModeRef.current = 'scroll';
          return;
        }
      }

      // Drag mode — track movement and prevent scroll
      if (touchModeRef.current === 'drag') {
        e.preventDefault();
        const offset = Math.max(0, deltaY * RESISTANCE_FACTOR);
        currentYRef.current = deltaY;
        setDragOffset(offset);
      }
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(() => {
    if (!enabled || touchModeRef.current !== 'drag') {
      touchModeRef.current = 'pending';
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    const velocity = currentYRef.current / elapsed; // px/ms
    const shouldClose =
      currentYRef.current > CLOSE_DISTANCE_THRESHOLD ||
      velocity > CLOSE_VELOCITY_THRESHOLD;

    if (shouldClose) {
      handleClose();
    } else {
      // Snap back
      setIsSnappingBack(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsSnappingBack(false);
      }, SNAPBACK_ANIMATION_MS);
    }

    setIsDragging(false);
    touchModeRef.current = 'pending';
  }, [enabled, handleClose]);

  const sheetRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Cleanup previous listeners
      if (elementRef.current) {
        elementRef.current.removeEventListener('touchstart', handleTouchStart);
        elementRef.current.removeEventListener('touchmove', handleTouchMove);
        elementRef.current.removeEventListener('touchend', handleTouchEnd);
      }

      elementRef.current = node;

      if (node) {
        node.addEventListener('touchstart', handleTouchStart, {
          passive: true,
        });
        node.addEventListener('touchmove', handleTouchMove, {
          passive: false,
        });
        node.addEventListener('touchend', handleTouchEnd, { passive: true });
      }
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener(
          'touchstart',
          handleTouchStart
        );
        elementRef.current.removeEventListener(
          'touchmove',
          handleTouchMove
        );
        elementRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Calculate sheet style based on drag state
  const sheetStyle: React.CSSProperties = isClosing
    ? {
        transform: 'translateY(100%)',
        transition: `transform ${CLOSE_ANIMATION_MS}ms ease-in`,
      }
    : isDragging
      ? {
          transform: `translateY(${dragOffset}px)`,
        }
      : isSnappingBack
        ? {
            transform: 'translateY(0)',
            transition: `transform ${SNAPBACK_ANIMATION_MS}ms ease-out`,
          }
        : {};

  // Overlay opacity: 1 at 0px offset, 0 at ~300px offset
  const overlayOpacity =
    isDragging || isSnappingBack
      ? Math.max(0, 1 - dragOffset / 300)
      : isClosing
        ? 0
        : 1;

  return {
    sheetRef,
    dragOffset,
    isDragging,
    isClosing,
    sheetStyle,
    overlayOpacity,
  };
}
