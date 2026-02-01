import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Dish } from '@/types/dish';

interface DishDetailContentProps {
  dish: Dish | null;
  isLoading: boolean;
}

export function DishDetailContent({ dish, isLoading }: DishDetailContentProps) {
  const mainImage = dish?.images?.[0];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 mt-2">読み込み中...</p>
      </div>
    );
  }

  if (!dish) return null;

  return (
    <>
      <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 mb-4">
        {mainImage ? (
          <Image
            src={mainImage.image_url}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {dish.images.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {dish.images.map((img) => (
            <div
              key={img.id}
              className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden"
            >
              <Image
                src={img.image_url}
                alt={`${dish.name} ${img.display_order}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h2>
      <p className="text-sm text-gray-500">
        {format(new Date(dish.cooked_at), 'yyyy年M月d日(E)', { locale: ja })}
      </p>
      {dish.category && (
        <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
          {dish.category.name}
        </span>
      )}
    </>
  );
}
