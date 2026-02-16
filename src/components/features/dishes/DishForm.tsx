'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/features/dishes/ImageUploader';
import { createDish, updateDish } from '@/lib/api/dishes';
import { ApiError } from '@/lib/api/client';
import type { Dish, DishImage } from '@/types/dish';

interface DishFormProps {
  defaultDate?: string;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  dish?: Dish;
}

export function DishForm({ defaultDate, onSuccess, mode = 'create', dish }: DishFormProps) {
  const router = useRouter();
  const [name, setName] = useState(mode === 'edit' && dish ? dish.name : '');
  const [cookedAt, setCookedAt] = useState(
    mode === 'edit' && dish
      ? dish.cooked_at
      : (defaultDate ?? format(new Date(), 'yyyy-MM-dd'))
  );
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<DishImage[]>(
    mode === 'edit' && dish ? dish.images : []
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = mode === 'edit';
  const totalImageCount = existingImages.length + imageKeys.length;

  const handleImageUpload = (imageKey: string) => {
    setImageKeys((prev) => [...prev, imageKey]);
  };

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleDeleteExistingImage = (image: DishImage) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
    setImagesToDelete((prev) => [...prev, image.id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('料理名を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit && dish) {
        await updateDish(dish.id, {
          name: name.trim(),
          cooked_at: cookedAt,
          images_to_add: imageKeys.length > 0
            ? imageKeys.map((key, index) => ({
                image_key: key,
                display_order: existingImages.length + index + 1,
              }))
            : undefined,
          images_to_delete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
        });
      } else {
        await createDish({
          name: name.trim(),
          cooked_at: cookedAt,
          images: imageKeys.map((key, index) => ({
            image_key: key,
            display_order: index + 1,
          })),
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/calendar');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(isEdit ? '料理の更新に失敗しました' : '料理の登録に失敗しました');
      } else {
        setError('エラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="flex-1 p-4 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isEdit ? '料理を編集' : '料理を登録'}
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            type="text"
            label="料理名"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: カレーライス"
            required
          />

          <Input
            type="date"
            label="調理日"
            name="cookedAt"
            value={cookedAt}
            onChange={(e) => setCookedAt(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              写真
            </label>

            {isEdit && existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={img.image_url}
                      alt={`${name} ${img.display_order}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 120px"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(img)}
                      className="absolute top-1 left-1 bg-black/50 rounded-full p-1 active:scale-95 transition-transform"
                      aria-label={`画像${img.display_order}を削除`}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalImageCount < 3 && (
              <ImageUploader
                onUploadComplete={handleImageUpload}
                onUploadError={handleImageError}
              />
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-2 px-4 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isEdit ? '更新する' : '登録する'}
        </Button>
      </div>
    </form>
  );
}
