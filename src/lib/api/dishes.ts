import { apiFetch } from './client';
import type {
  Dish,
  DishCreateRequest,
  DishListParams,
  DishListResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from '@/types/dish';

export async function getDishes(params?: DishListParams): Promise<DishListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.cursor) searchParams.set('cursor', params.cursor);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.category_id) searchParams.set('category_id', params.category_id);
  if (params?.from_date) searchParams.set('from_date', params.from_date);
  if (params?.to_date) searchParams.set('to_date', params.to_date);

  const query = searchParams.toString();
  const endpoint = `/api/dishes${query ? `?${query}` : ''}`;

  return apiFetch<DishListResponse>(endpoint);
}

export async function getDish(id: string): Promise<Dish> {
  return apiFetch<Dish>(`/api/dishes/${id}`);
}

export async function createDish(data: DishCreateRequest): Promise<Dish> {
  return apiFetch<Dish>('/api/dishes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPresignedUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  return apiFetch<PresignedUrlResponse>('/api/dishes/images/presigned-url', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function uploadImageToS3(
  url: string,
  file: Blob,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
