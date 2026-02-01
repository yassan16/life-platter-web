'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { clsx } from 'clsx';
import { getDishes } from '@/lib/api/dishes';
import type { DishListItem } from '@/types/dish';
import { DayDetailSheet } from '@/components/features/calendar/DayDetailSheet';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dishes, setDishes] = useState<DishListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDaySheetOpen, setIsDaySheetOpen] = useState(false);
  const [daySheetDate, setDaySheetDate] = useState('');

  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const response = await getDishes({
        from_date: format(start, 'yyyy-MM-dd'),
        to_date: format(end, 'yyyy-MM-dd'),
      });
      setDishes(response.items);
    } catch (error) {
      console.error('Failed to fetch dishes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  useEffect(() => {
    setIsDaySheetOpen(false);
    setDaySheetDate('');
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDishesForDate = (date: Date): DishListItem[] => {
    return dishes.filter((dish) => isSameDay(new Date(dish.cooked_at), date));
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDishAdded = () => {
    fetchDishes();
  };

  const handleCloseDaySheet = () => {
    setIsDaySheetOpen(false);
    setDaySheetDate('');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
          aria-label="前の月"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
        </button>

        <h2 className="text-lg font-bold text-gray-900">
          {format(currentDate, 'yyyy年M月', { locale: ja })}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
          aria-label="次の月"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={clsx(
              'text-center text-xs font-medium py-2',
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayDishes = getDishesForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const dayOfWeek = day.getDay();

          const handleCellClick = () => {
            if (isCurrentMonth && !isLoading) {
              setDaySheetDate(format(day, 'yyyy-MM-dd'));
              setIsDaySheetOpen(true);
            }
          };

          return (
            <button
              key={day.toISOString()}
              onClick={handleCellClick}
              type="button"
              aria-label={`${format(day, 'M月d日')}${dayDishes.length > 0 ? ` ${dayDishes.length}件の料理` : ''}`}
              disabled={!isCurrentMonth || isLoading}
              className={clsx(
                'min-h-[80px] p-1 rounded-lg border text-left w-full',
                isCurrentMonth ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-50',
                isToday && 'ring-2 ring-orange-500',
                isCurrentMonth && !isLoading && 'cursor-pointer'
              )}
            >
              <div
                className={clsx(
                  'text-xs font-medium mb-1',
                  !isCurrentMonth && 'text-gray-300',
                  isCurrentMonth && dayOfWeek === 0 && 'text-red-500',
                  isCurrentMonth && dayOfWeek === 6 && 'text-blue-500',
                  isCurrentMonth && dayOfWeek !== 0 && dayOfWeek !== 6 && 'text-gray-600'
                )}
              >
                {format(day, 'd')}
              </div>

              {isLoading && isCurrentMonth && (
                <div className="flex justify-center">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!isLoading && dayDishes.length > 0 && (
                <div className="space-y-1">
                  {dayDishes.slice(0, 2).map((dish) => (
                    <div key={dish.id} className="w-full rounded overflow-hidden">
                      {dish.thumbnail_url ? (
                        <div className="relative aspect-square">
                          <Image
                            src={dish.thumbnail_url}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            sizes="60px"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-orange-100 flex items-center justify-center">
                          <span className="text-[8px] text-orange-600 truncate px-0.5">
                            {dish.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {dayDishes.length > 2 && (
                    <div className="text-[10px] text-gray-400 text-center">
                      +{dayDishes.length - 2}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <DayDetailSheet
        isOpen={isDaySheetOpen}
        onClose={handleCloseDaySheet}
        date={daySheetDate}
        dishes={daySheetDate ? getDishesForDate(new Date(daySheetDate + 'T00:00:00')) : []}
        onDishAdded={handleDishAdded}
      />
    </div>
  );
}
