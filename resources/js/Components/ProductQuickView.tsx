// ProductQuickView.tsx
import React, { useState, useEffect, useRef } from "react";
import { X, CirclePlus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/Product";

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, qty?: number) => void;
}

export default function ProductQuickView({ product, isOpen, onClose, onAddToCart }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1595341888016-a392ef81b7de";
    e.currentTarget.alt = "Product placeholder image";
  };

  // Called when Add to Cart is clicked
  const handleAddToCart = () => {
    onAddToCart(product.id, 1);
    setAdded(true);
    // revert after 1.5s
    window.setTimeout(() => setAdded(false), 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.20, ease: "easeOut" }}
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>

            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images?.[currentImage]?.image_path || ""}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div className="flex gap-2">
                  {product.images?.map((image, index) => (
                    <button
                      key={image.id ?? index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden ${currentImage === index ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <img
                        src={image.image_path}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">₱{product.discount_price}</span>
                      <span className="text-lg text-gray-500 line-through">₱{product.price}</span>
                    </div>
                  </div>
                  <p
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
                  ></p>
                </div>

                {/* Add to cart button with animation */}
                <div className="mt-6 flex justify-start md:justify-start">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || added}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold
                      ${added ? "bg-green-600 text-white" : "bg-onpoint-btnblue text-white hover:bg-onpoint-dark-blue"}
                    `}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {added ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Added!
                        </motion.div>
                      ) : (
                        <motion.div
                          key="add"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-2"
                        >
                          <CirclePlus />
                          Add to Cart
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
