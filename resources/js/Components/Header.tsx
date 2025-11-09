import { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { Link } from "@inertiajs/react";
import { Maximize, Minimize } from "lucide-react"; 
import { User } from "@/types/User";

interface HeaderProps {
  user: User;
}

const Header = () => {
  const { openSidebar } = useSidebar();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit full-screen mode:", err);
      });
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100">
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
        <div className="flex items-center gap-4">
          <div
            className="text-sm text-gray-600 font-semibold cursor-pointer select-none"
            onClick={openSidebar}
          >
            Get your custom quote today!
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-gray-600" />
            ) : (
              <Maximize className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;