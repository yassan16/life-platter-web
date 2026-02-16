'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { DishCard } from './DishCard';
import { DishDetailModal } from './DishDetailModal';
import { useDishes } from '@/lib/hooks/useDishes';
import { getDish } from '@/lib/api/dishes';
import type { Dish, DishListItem } from '@/types/dish';

export function DishList() {
  const { dishes, isLoading, hasMore, error, loadMore, refresh, removeDish } = useDishes({ limit: 20 });
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleDishClick = async (dish: DishListItem) => {
    setIsLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const detail = await getDish(dish.id);
      setSelectedDish(detail);
    } catch (err) {
      console.error('Failed to fetch dish detail:', err);
      setIsModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDish(null);
  };

  const handleDishUpdated = () => {
    refresh();
  };

  const handleDishDeleted = (dishId: string) => {
    removeDish(dishId);
    setIsModalOpen(false);
    setSelectedDish(null);
  };

  if (error && dishes.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => loadMore()}
          className="mt-2 text-orange-500 hover:underline"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">料理一覧</h2>

      {dishes.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-500">まだ料理が登録されていません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onClick={() => handleDishClick(dish)}
            />
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="py-4">
        {isLoading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {!hasMore && dishes.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          すべての料理を表示しました
        </p>
      )}

      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isLoadingDetail}
        onDishUpdated={handleDishUpdated}
        onDishDeleted={handleDishDeleted}
      />
    </div>
  );
}
