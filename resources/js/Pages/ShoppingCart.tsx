import { useEffect, useState } from "react";
import { ChevronLeft, Check } from 'lucide-react';
import Header from "@/Components/Header";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Product } from "@/types/Product";
import { motion, AnimatePresence } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types"; 
import { Head } from '@inertiajs/react';

function ShoppingCart({ auth }: PageProps) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [instantUpdate, setInstantUpdate] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    const parsed = saved ? JSON.parse(saved) : {};
    setCart(parsed);
    setInitialized(true); // now safe to fetch
  }, []);

  useEffect(() => {
    if (!initialized) return;

    if (instantUpdate) {
      // instant save (typing)
      localStorage.setItem("cart", JSON.stringify(cart));
      setInstantUpdate(false); // reset
      return;
    }

    // debounced save (buttons)
    const timer = setTimeout(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, 300);

    return () => clearTimeout(timer);
  }, [cart, initialized, instantUpdate]);

  // Fetch product details for items in cart
  useEffect(() => {
    if (!initialized) return;

    if (instantUpdate) {
      // 🚀 instant fetch (typing)
      const ids = Object.keys(cart).map(Number).filter(Boolean);
      if (ids.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      axios.post("/api/products/by-ids", { ids }).then((res) => {
        const products: Product[] = res.data;
        setCartItems(
          products.map((p) => ({
            ...p,
            quantity: cart[p.id] ?? 0,
          }))
        );
        setLoading(false);
      });
      return;
    }

    // ⏳ debounced fetch (buttons)
    const timer = setTimeout(() => {
      const ids = Object.keys(cart).map(Number).filter(Boolean);
      if (ids.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      axios.post("/api/products/by-ids", { ids }).then((res) => {
        const products: Product[] = res.data;
        setCartItems(
          products.map((p) => ({
            ...p,
            quantity: cart[p.id] ?? 0,
          }))
        );
        setLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [cart, initialized, instantUpdate]);

  const removeItem = (id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const subtotal = cartItems.reduce((total, item) => {
    const unit = parseFloat(item.discount_price || item.price) || 0;
    return total + unit * (item.quantity || 0);
  }, 0);

  const cartItemCount = Object.values(cart).reduce(
    (sum, count) => sum + count,
    0
  );

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  };

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }

    setCart((prev) => {
      const next = { ...prev, [id]: newQty };
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  const incrementQty = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementQty = (id: number) => {
    setCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 1) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const setQuantityInstant = (id: number, value: number) => {
    setCart((prev) => {
      const next = { ...prev, [id]: value };
      if (value <= 0) delete next[id];
      localStorage.setItem("cart", JSON.stringify(next)); // save immediately
      return next;
    });
    setInstantUpdate(true); // 🚀 tell effects to run instantly
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src.includes("/images/no-image.jpeg")) return;
    target.src = "/images/no-image.jpeg";
    target.alt = "Product placeholder image";
  };

  return (
    <>
      <Head title="OnPoint | Review Cart" />
      <AuthenticatedLayout user={auth.user}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeInOut" }} 
          className="max-w-[1480px] mx-auto bg-white min-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white">
            <Link href="/devices" className="flex items-center text-gray-700 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="text-base">Back</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Review Cart</h1>
            <div className="w-12"></div>
          </div>

          {/* Content */}
          <div className="flex-1 px-4 pb-2 md:pb-2 lg:pb-32">
            {cartItems.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500 text-center">Cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4 mt-6 h-[calc(100vh-200px)] xl:h-[calc(100vh-300px)] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-white min-h-24 py-5 border-b ">
                    {/* Product Image */}
                    <div className="w-28 h-28 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.images?.[0]?.image_path || "/images/no-image.jpeg"}
                          alt={item.name}
                          onError={handleImageError}
                          className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col w-full gap-y-12">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-gray-900 text-xl font-medium">{item.name}</h3>
                        <div className="flex items-center rounded-md border border-gray-200">
                          <button
                            onClick={() => decrementQty(item.id)}
                            className="px-3 py-1"
                          >
                            -
                          </button>
                          <input
                              type="text"
                              value={item.quantity}
                              min={0}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  if (isNaN(value) || value < 0) return;
                                  setQuantityInstant(item.id, value); // ✅ instant update
                                }}
                              className="w-16 text-center border-l border-r border-gray-200 focus:outline-none"
                            />
                          <button
                            onClick={() => incrementQty(item.id)}
                            className="px-3 py-1"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 text-xl font-medium">
                          {formatPrice(parseFloat(item.discount_price || item.price))}
                        </span>
                        {/* {item.stock > 0 && (
                          <div className="flex items-center text-green-600 text-base">
                            <Check className="w-4 h-4 mr-1" />
                            <span>In Stock</span>
                          </div>
                        )} */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-blue-600 text-base hover:text-blue-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="max-w-[1480px] fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-900 text-xl font-medium">Subtotal</span>
              <span className="text-gray-900 text-xl font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {cartItemCount > 0 ? (
              <Link
                href="/payment-terms"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
              >
                Continue
              </Link>
            ) : (
              <span
                className="block w-full text-center px-12 py-3 select-none text-base font-medium rounded-lg transition-all bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                No items in cart
              </span>
            )}
          </div>
        </motion.div>
      </AuthenticatedLayout>
    </>
  );
}

export default ShoppingCart;