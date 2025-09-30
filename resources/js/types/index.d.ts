import { User } from "./User";

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: "admin" | "manager" | "staff";
  is_active: boolean;
}

export type PageProps<T = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
};
