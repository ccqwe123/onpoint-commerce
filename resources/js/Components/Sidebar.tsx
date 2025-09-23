// components/Sidebar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { Home, ShoppingCart, Settings, LogOut } from "lucide-react";
import { usePage, Link } from '@inertiajs/react';
import axios from "axios";

interface SidebarProps { currentUrl: string }

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const [currentUrl, setCurrentUrl] = useState(window.location.pathname);

  useEffect(() => {
    const onNavigate = (event: any) => {
      setCurrentUrl(event.detail.page.url); // updates URL reactively
    };

    document.addEventListener('inertia:navigate', onNavigate);

    return () => document.removeEventListener('inertia:navigate', onNavigate);
  }, []);

  const isActive = (path: string) => currentUrl.includes(path);
  console.log(isActive);
  console.log(currentUrl);
  console.log(isActive("/plans"));
  const logoutUser = async () => {
     try {
          await axios.get("/logout"),

          localStorage.removeItem("cart");
          localStorage.removeItem("selectedPlan");
          localStorage.removeItem("payment");

          window.location.href = "/login";
      } catch (err) {
          console.error("Failed to submit order", err);
      } 
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <motion.aside
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-72 bg-white text-black shadow-2xl z-50 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/20">
              <img
                src="/images/lugu.png"
                alt="Logo"
                className="h-8 w-auto mx-auto"
              />
            </div>

            {/* Menu */}
            <nav className="flex-1 px-6 py-8 space-y-6">
              <Link
                href="/plans"
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition ${
                  isActive("/plans") ? "bg-onpoint-btnblue text-white" : ""
                }`}
              >
                <Home size={20} />
                <span className="font-medium">Plans</span>
              </Link>

              <Link
                href="/product-categories"
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition ${
                  isActive("/product-categories") ? "bg-onpoint-btnblue text-white" : ""
                }`}
              >
                <ShoppingCart size={20} />
                <span className="font-medium">Product Categories</span>
              </Link>

              <Link
                href="/quotation"
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition ${
                  isActive("/quotation") ? "bg-onpoint-btnblue text-white" : ""
                }`}
              >
                <Settings size={20} />
                <span className="font-medium">Quotation</span>
              </Link>
            </nav>

            {/* Logout */}
            <div className="p-6 border-t border-white/20">
              <a
                onClick={() => {
                  closeSidebar();
                  logoutUser();
                }}
                className="w-full flex cursor-pointer select-none items-center justify-center gap-3 px-4 py-3 bg-onpoint-btnblue text-white hover:bg-black rounded-xl transition font-semibold"
              >
                <LogOut size={18} />
                Logout
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;