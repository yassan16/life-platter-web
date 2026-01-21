'use client';

import { useState, useCallback } from 'react';
import { getDishes } from '@/lib/api/dishes';
import type { DishListItem, DishListParams } from '@/types/dish';

interface UseDishesResult {
  dishes: DishListItem[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDishes(params?: Omit<DishListParams, 'cursor'>): UseDishesResult {
  const [dishes, setDishes] = useState<DishListItem[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchDishes = useCallback(
    async (reset: boolean = false) => {
      if (isLoading) return;
      if (!reset && !hasMore) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getDishes({
          ...params,
          cursor: reset ? undefined : cursor,
        });

        if (reset) {
          setDishes(response.items);
        } else {
          setDishes((prev) => [...prev, ...response.items]);
        }

        setCursor(response.next_cursor ?? undefined);
        setHasMore(response.has_next);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to fetch dishes:', err);
        setError('料理の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    },
    [params, cursor, hasMore, isLoading]
  );

  const loadMore = useCallback(async () => {
    if (!isInitialized) {
      await fetchDishes(true);
    } else {
      await fetchDishes(false);
    }
  }, [fetchDishes, isInitialized]);

  const refresh = useCallback(async () => {
    setCursor(undefined);
    setHasMore(true);
    await fetchDishes(true);
  }, [fetchDishes]);

  return {
    dishes,
    isLoading,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
