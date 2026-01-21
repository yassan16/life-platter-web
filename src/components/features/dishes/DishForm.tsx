'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/features/dishes/ImageUploader';
import { createDish } from '@/lib/api/dishes';
import { ApiError } from '@/lib/api/client';

export function DishForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cookedAt, setCookedAt] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (imageKey: string) => {
    setImageKeys((prev) => [...prev, imageKey]);
  };

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage);
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
      await createDish({
        name: name.trim(),
        cooked_at: cookedAt,
        images: imageKeys.map((key, index) => ({
          image_key: key,
          display_order: index + 1,
        })),
      });

      router.push('/calendar');
    } catch (err) {
      if (err instanceof ApiError) {
        setError('料理の登録に失敗しました');
      } else {
        setError('エラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">料理を登録</h2>

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
          <ImageUploader
            onUploadComplete={handleImageUpload}
            onUploadError={handleImageError}
          />
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
        size="lg"
      >
        登録する
      </Button>
    </form>
  );
}
