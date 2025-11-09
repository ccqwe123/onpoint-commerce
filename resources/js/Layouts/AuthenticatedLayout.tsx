import { ReactNode } from "react";
import Header from "@/Components/Header";
import { User } from "@/types/User";
import Sidebar from "@/Components/Sidebar";
import clsx from "clsx";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  user: User;
  className?: string;
}

export default function AuthenticatedLayout({ children, user, className = '' }: AuthenticatedLayoutProps) {
  return (
    <div className={clsx("relative flex min-h-screen bg-white ", className)}>
    {/* <div className="relative min-h-screen bg-white flex"> */}
      <Sidebar currentUrl={window.location.pathname} user={user} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
