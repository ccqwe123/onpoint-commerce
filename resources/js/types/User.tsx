export interface User {
    id: number;
    name: string;
    email: string;
    position: string | null;
    user_type: "" | "admin" | "manager" | "staff";
    is_active: boolean;
}