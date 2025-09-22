export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_primary: number;
  created_at: string;
  updated_at: string;
}
interface Category {
  id: number;
  name: string;
  is_active: number;
}
export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  category?: Category;
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
