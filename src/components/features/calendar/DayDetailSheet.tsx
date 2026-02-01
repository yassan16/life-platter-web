'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DishForm } from '@/components/features/dishes/DishForm';
import { DishDetailContent } from '@/components/features/dishes/DishDetailContent';
import { getDish } from '@/lib/api/dishes';
import type { Dish, DishListItem } from '@/types/dish';

type SheetView = 'list' | 'add' | 'detail';

interface DayDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  dishes: DishListItem[];
  onDishAdded: () => void;
}

function DayDetailSheetContent({
  date,
  dishes,
  onDishAdded,
  view,
  setView,
}: Omit<DayDetailSheetProps, 'isOpen' | 'onClose'> & {
  view: SheetView;
  setView: (view: SheetView) => void;
}) {
  const [dishDetail, setDishDetail] = useState<Dish | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleAddSuccess = () => {
    onDishAdded();
    setView('list');
  };

  const handleDishClick = async (dish: DishListItem) => {
    setDishDetail(null);
    setIsLoadingDetail(true);
    setView('detail');
    try {
      const detail = await getDish(dish.id);
      setDishDetail(detail);
    } catch (err) {
      console.error('Failed to fetch dish detail:', err);
      setView('list');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleBack = () => {
    setView('list');
    setDishDetail(null);
  };

  const formattedDate = date
    ? format(parseISO(date), 'M月d日(E)', { locale: ja })
    : '';

  if (view === 'detail') {
    return (
      <div className="px-4 pb-safe pb-8 motion-safe:animate-slide-in-right">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-2"
          aria-label="一覧に戻る"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          戻る
        </button>
        <DishDetailContent dish={dishDetail} isLoading={isLoadingDetail} />
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-2 px-4"
          aria-label="一覧に戻る"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          戻る
        </button>
        <DishForm defaultDate={date} onSuccess={handleAddSuccess} />
      </div>
    );
  }

  return (
    <div className="px-4 pb-safe pb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {formattedDate}
      </h2>

      <div aria-live="polite">
        {dishes.length > 0 ? (
          <div className="space-y-2">
            {dishes.map((dish) => (
              <button
                key={dish.id}
                onClick={() => handleDishClick(dish)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-[0.98]"
              >
                {dish.thumbnail_url ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={dish.thumbnail_url}
                      alt={dish.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>
                )}
                <span className="flex-1 text-left text-sm font-medium text-gray-900 truncate">
                  {dish.name}
                </span>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            まだ料理が登録されていません
          </p>
        )}
      </div>

      <div className="mt-4">
        <Button
          onClick={() => setView('add')}
          className="w-full"
          size="lg"
        >
          ＋ 料理を追加
        </Button>
      </div>
    </div>
  );
}

export function DayDetailSheet({
  isOpen,
  onClose,
  date,
  dishes,
  onDishAdded,
}: DayDetailSheetProps) {
  const [view, setView] = useState<SheetView>('list');

  const handleClose = useCallback(() => {
    setView('list');
    onClose();
  }, [onClose]);

  const handleEscape = useCallback(() => {
    if (view !== 'list') {
      setView('list');
    } else {
      handleClose();
    }
  }, [view, handleClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} onEscape={handleEscape}>
      <DayDetailSheetContent
        key={date}
        date={date}
        dishes={dishes}
        onDishAdded={onDishAdded}
        view={view}
        setView={setView}
      />
    </Modal>
  );
}
