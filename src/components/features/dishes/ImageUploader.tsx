'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { compressImage } from '@/lib/utils/imageCompress';
import { getPresignedUrl, uploadImageToS3 } from '@/lib/api/dishes';

interface ImageUploaderProps {
  onUploadComplete: (imageKey: string) => void;
  onUploadError: (error: string) => void;
}

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  imageKey?: string;
}

export function ImageUploader({ onUploadComplete, onUploadError }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadingImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const newImages: UploadingImage[] = filesToProcess.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const,
    }));

    setImages((prev) => [...prev, ...newImages]);

    for (const img of newImages) {
      await uploadImage(img);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const uploadImage = async (img: UploadingImage) => {
    try {
      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id ? { ...i, status: 'uploading' as const, progress: 0 } : i
        )
      );

      const compressed = await compressImage(img.file);

      const { upload_url, image_key } = await getPresignedUrl();

      await uploadImageToS3(upload_url, compressed, (progress) => {
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, progress } : i))
        );
      });

      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id
            ? { ...i, status: 'completed' as const, progress: 100, imageKey: image_key }
            : i
        )
      );

      onUploadComplete(image_key);
    } catch (error) {
      console.error('Upload failed:', error);
      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id ? { ...i, status: 'error' as const } : i
        )
      );
      onUploadError('画像のアップロードに失敗しました');
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.preview) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const retryUpload = (img: UploadingImage) => {
    uploadImage(img);
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={img.preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 120px"
              />

              {img.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white/30"
                        strokeDasharray="100, 100"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="text-white"
                        strokeDasharray={`${img.progress}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                      {img.progress}%
                    </span>
                  </div>
                </div>
              )}

              {img.status === 'completed' && (
                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {img.status === 'error' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button
                    onClick={() => retryUpload(img)}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                  >
                    再試行
                  </button>
                </div>
              )}

              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 left-1 bg-black/50 rounded-full p-1 active:scale-95 transition-transform"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < 3 && (
        <label
          htmlFor="image-input"
          className={clsx(
            'flex flex-col items-center justify-center',
            'border-2 border-dashed border-gray-300 rounded-xl',
            'py-8 cursor-pointer transition-colors',
            'hover:border-orange-400 hover:bg-orange-50',
            'active:scale-[0.98]'
          )}
        >
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
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
          <span className="text-sm text-gray-500">写真を選択</span>
          <span className="text-xs text-gray-400 mt-1">
            最大3枚まで
          </span>
          <input
            ref={inputRef}
            id="image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
