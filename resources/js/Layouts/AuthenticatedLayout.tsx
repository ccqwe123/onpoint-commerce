import { ReactNode } from "react";
import Header from "@/Components/Header";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="relative min-h-screen bg-white">
      <Header/>
      <main>{children}</main>
    </div>
  );
}
