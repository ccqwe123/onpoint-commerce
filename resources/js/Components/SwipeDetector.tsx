import { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

const SwipeDetector = () => {
  const { openSidebar, closeSidebar, isOpen } = useSidebar();

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    };

    const handleGesture = () => {
      const diffX = touchEndX - touchStartX;

      // 👉 Swipe right from left edge = open
      if (touchStartX < 550 && diffX > 800 && !isOpen) {
        openSidebar();
      }

      // 👈 Swipe left from inside screen = close
      if (isOpen && diffX < -80) {
        closeSidebar();
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [openSidebar, closeSidebar, isOpen]);

  return null;
};

export default SwipeDetector;
