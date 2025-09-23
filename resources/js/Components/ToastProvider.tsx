"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

export function ToastProvider() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"success" | "error" | "info">("info");

  const showToast = (
    msg: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setMessage(msg);
    setVariant(type);
    setOpen(false);
    setTimeout(() => setOpen(true), 10);
  };

  (window as any).showToast = showToast;

  const variantStyles = {
    success: {
      icon: <CheckCircle className="text-green-600 w-5 h-5" />,
      classes: "border-green-500 bg-green-50 text-green-700",
    },
    error: {
      icon: <XCircle className="text-red-600 w-5 h-5" />,
      classes: "border-red-500 bg-red-50 text-red-700",
    },
    info: {
      icon: <Info className="text-blue-600 w-5 h-5" />,
      classes: "border-blue-500 bg-blue-50 text-blue-700",
    },
  };

  const { icon, classes } = variantStyles[variant];

  return (
    <Toast.Provider swipeDirection="right">
      <AnimatePresence>
        {open && (
          <Toast.Root
            forceMount
            open={open}
            onOpenChange={setOpen}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg shadow-lg px-4 py-3 border text-sm font-medium flex items-center gap-3 ${classes}`}
            >
              {icon}
              <span>{message}</span>
            </motion.div>
          </Toast.Root>
        )}
      </AnimatePresence>

      <Toast.Viewport className="fixed top-4 right-4 flex flex-col gap-2 w-80 z-50 outline-none" />
    </Toast.Provider>
  );
}
