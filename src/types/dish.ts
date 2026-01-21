export interface Category {
  id: string;
  name: string;
}

export interface DishImage {
  id: string;
  image_url: string;
  display_order: number;
}

export interface Dish {
  id: string;
  name: string;
  cooked_at: string;
  category?: Category | null;
  images: DishImage[];
  created_at: string;
  updated_at: string;
}

export interface DishListItem {
  id: string;
  name: string;
  cooked_at: string;
  category?: Category | null;
  thumbnail_url?: string | null;
  image_count: number;
  created_at: string;
}

export interface ImageInput {
  image_key: string;
  display_order: number;
}

export interface DishCreateRequest {
  name: string;
  cooked_at: string;
  category_id?: string;
  images?: ImageInput[];
}

export interface DishListResponse {
  items: DishListItem[];
  next_cursor?: string | null;
  has_next: boolean;
}

export interface DishListParams {
  cursor?: string;
  limit?: number;
  category_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  image_key: string;
}
