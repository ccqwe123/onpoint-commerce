import { ReactNode } from "react";
import Header from "@/Components/Header";
import { User } from "@/types/User";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  user: User;
}

export default function AuthenticatedLayout({ children, user  }: AuthenticatedLayoutProps) {
  return (
    <div className="relative min-h-screen bg-white">
      <Header />
      <main>{children}</main>
    </div>
  );
}
