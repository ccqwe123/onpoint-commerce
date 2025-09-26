export interface PlanDescription {
  id: number | null;
  plan_id: number;
  name: string;  
}

export interface Plan {
  id: number;
  name: string;
  price: string | null;
  description: string | null;
  discount_price: string | null;
  type: "monthly" | "annual" | "custom";
  descriptions: string[];
  is_active: boolean;
}

export interface PlanData {
  id: number;
  name: string;
  price: string | null;
  description: string | null;
  discount_price: string | null;
  type: "monthly" | "annual" | "custom";
  is_active: boolean;
  descriptions: PlanDescription[];
}

export interface Order {
  id: number;
  plan: PlanData | null;
  subtotal: string;
  payment: string | null;
  items: OrderItem[];
  client: Client | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: string;
  price: string;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
}
export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
}
