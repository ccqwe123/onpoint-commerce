export interface PlanDescription {
  id: number | null;
  name: string;  
}

export interface Plan {
  id: number;
  name: string;
  price: string | null;
  discount_price: string | null;
  type: "monthly" | "annual" | "custom";
  descriptions: string[];
  is_active: boolean;
}

export interface PlanData {
  id: number;
  name: string;
  price: string | null;
  discount_price: string | null;
  type: "monthly" | "annual" | "custom";
  is_active: boolean;
  descriptions: PlanDescription[];
}