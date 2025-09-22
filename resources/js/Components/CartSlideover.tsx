import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle
} from "@headlessui/react";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/types/Product";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  cart: Record<number, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export default function CartSlideover({ open, setOpen, cart, setCart }: Props) {
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ids = Object.keys(cart).map(Number).filter(Boolean);
    if (ids.length === 0) {
      setCartItems([]);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await axios.post("/api/products/by-ids", { ids });
        const products: Product[] = res.data;

        if (!mounted) return;

        setCartItems(
          products.map((p) => ({
            ...p,
            quantity: cart[p.id] ?? 0,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch cart products", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [cart]);

  // Update quantity
  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] || 0) + delta;
      if (newQty <= 0) delete next[id];
      else next[id] = newQty;
      return next;
    });
  };

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Subtotal (using discount_price if available)
  const subtotal = cartItems.reduce((sum, p) => {
    const unit = parseFloat(p.discount_price || p.price) || 0;
    return sum + unit * (p.quantity || 0);
  }, 0);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                {/* Header */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <button
                      onClick={() => setOpen(false)}
                      className="ml-3 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="mt-8">
                    {cartItems.length === 0 ? (
                      <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((product) => {
                          const unit = parseFloat(product.discount_price || product.price) || 0;
                          return (
                            <li key={product.id} className="flex py-6">
                              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={product.images?.[0]?.image_path || "/images/placeholder.png"}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{product.name}</h3>
                                  <p className="ml-4">
                                    ₱{(unit * product.quantity).toFixed(2)}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{product.description}</p>

                                {/* Quantity controls */}
                                <div className="mt-2 flex items-center gap-3">
                                  <div className="flex items-center rounded-md border border-gray-200">
                                    <button
                                      onClick={() => updateQuantity(product.id, -1)}
                                      className="px-3 py-1"
                                    >
                                      -
                                    </button>
                                    <span className="px-4">{product.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(product.id, 1)}
                                      className="px-3 py-1"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(product.id)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₱{subtotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => (window.location.href = "/shopping-cart")}
                      className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Continue Shopping →
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
