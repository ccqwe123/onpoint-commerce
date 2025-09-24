import { useSidebar } from "@/context/SidebarContext";
import { Link } from "@inertiajs/react";

const Header = () => {
  const { openSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-[1480px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" 
          onClick={() => {
            localStorage.removeItem("cart");
            localStorage.removeItem("selectedPlan");
            localStorage.removeItem("payment");
          }}
          className="flex items-center">
          <img src="/images/lugu.png" className="h-6 w-auto"/>
        </Link>
        <div className="text-sm text-gray-600 font-semibold cursor-pointer select-none" onClick={openSidebar}>
          Get your custom quote today!
        </div>
      </div>
    </header>
  );
};

export default Header;