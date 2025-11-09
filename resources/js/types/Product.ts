import { FileUpload, UploadedFile } from '@/Components/ui/file-upload';

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_primary: number;
  created_at: string;
  updated_at: string;
}
export interface Category {
  id: number;
  name: string;
  is_active: boolean;
}
export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  category?: Category;
}

export interface ToggleProduct {
  id: number;
  name: string;
  is_active: boolean;
}

export interface ProductView {
  id: number;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  stock: number;
  images: string[]; 
}

export interface ExistingUploadedFile {
  id: string;
  file: File | null;
  previewUrl: string;
  isExisting: true;
  existingImageId: number;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export type FormUploadedFile = UploadedFile | ExistingUploadedFile;