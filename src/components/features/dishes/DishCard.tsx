'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { DishListItem } from '@/types/dish';

interface DishCardProps {
  dish: DishListItem;
  onClick: () => void;
}

export function DishCard({ dish, onClick }: DishCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex">
        <div className="w-24 h-24 relative flex-shrink-0">
          {dish.thumbnail_url ? (
            <Image
              src={dish.thumbnail_url}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 p-3 flex flex-col justify-center text-left">
          <h3 className="font-medium text-gray-900 line-clamp-1">{dish.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(dish.cooked_at), 'M月d日(E)', { locale: ja })}
          </p>
        </div>
        <div className="flex items-center pr-3">
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
