import { useEffect, useState } from "react";
import { Check } from 'lucide-react';
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Product } from "@/types/Product";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface PaymentTermsProps {
  onContinue: () => void;
}

const PaymentTerms: React.FC<PaymentTermsProps> = ({ onContinue }) => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [payment, setPayment] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<'one-time' | '6-months' | '12-months' | '24-months'>('one-time');
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [replacementProducts, setReplacementProducts] = useState<Product[]>([]);
  const [replacementSelections, setReplacementSelections] = useState<Record<number, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    const parsed = saved ? JSON.parse(saved) : {};
    setCart(parsed);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("payment") as
      | 'one-time'
      | '6-months'
      | '12-months'
      | '24-months'
      | null;

    const planMap: Record<typeof selectedPayment, number> = {
      'one-time': 1,
      '6-months': 6,
      '12-months': 12,
      '24-months': 24,
    };

    if (saved && planMap[saved]) {
      setSelectedPayment(saved);
      setPayment(planMap[saved]);
    } else {
      localStorage.setItem("payment", "one-time");
      setSelectedPayment("one-time");
      setPayment(1);
    }
  }, []);

  useEffect(() => {
    const ids = Object.keys(cart).map(Number).filter(Boolean);
    if (ids.length === 0) {
      setCartItems([]);
      return;
    }

    axios.post("/api/products/by-ids", { ids }).then((res) => {
      const products: Product[] = res.data;
      setCartItems(
        products.map((p) => ({
          ...p,
          quantity: cart[p.id] ?? 0,
        }))
      );
    });
  }, [cart]);
  
  const subtotal = cartItems.reduce((sum, p) => {
    const unit = parseFloat(p.discount_price || p.price) || 0;
    return sum + unit * (p.quantity || 0);
  }, 0);

  const downpayment = subtotal * 0.3;

  const formatPrice = (price: number) => {
    return `P ${price.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleOpenReplaceModal = async (item: Product) => {
    setSelectedItem(item);
    setShowReplaceModal(true);

    const res = await axios.get(`/api/category/${item.category_id}/products`);
    setReplacementProducts(res.data.filter((p: Product) => p.id !== item.id));
  };

  const handleReplaceProduct = (newProduct: Product) => {
  if (!selectedItem) return;

  setCart((prev) => {
      const next = { ...prev };
      // Keep the same quantity but replace product id
      const qty = next[selectedItem.id];
      delete next[selectedItem.id];
      next[newProduct.id] = qty;
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });

    setShowReplaceModal(false);
    setSelectedItem(null);
  };

  const handleQuantityChange = (productId: number, qty: number) => {
    setReplacementSelections((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty),
    }));
  };

  const handleSubmitReplacement = () => {
    if (!selectedItem) return;

    setCart((prev) => {
      const next = { ...prev };

      // remove old product
      delete next[selectedItem.id];

      // add all replacements with their chosen quantities
      Object.entries(replacementSelections).forEach(([id, qty]) => {
        const productId = Number(id);
        if (qty > 0) {
          next[productId] = (next[productId] || 0) + qty;
        }
      });

      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });

    // reset modal state
    setReplacementSelections({});
    setShowReplaceModal(false);
    setSelectedItem(null);
  };
  return (
    <AuthenticatedLayout>
      <motion.div  className="max-w-[1480px] mx-auto px-4 py-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        >
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">STEP 3 OF 3</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Choose your payment terms.</h1>
        </div>

        {/* Add-ons Table */}
        <div className="mb-8 relative">
          <div className="bg-gray-900 text-white px-4 py-3 font-semibold">
            ADD ONS
          </div>
          
          <div className="bg-onpoint-btnblue absolute top-15 right-0 
              rounded-br-xl rounded-bl-xl w-[60%] h-10 
              text-center text-white flex items-center justify-center">
            0% Interest
          </div>
          <div className="">
            {/* Table Header */}

              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-gray-700 mt-10">
                <div className="text-base font-semibold">Device</div>
                <div className="text-base font-semibold">Price</div>
                <div className="text-center text-base font-semibold">One Time</div>
                <div className="text-center text-base font-semibold">6 mos.</div>
                <div className="text-center text-base font-semibold">12 mos.</div>
              </div>
            {/* Table Row */}
            <div className="grid grid-cols-5 gap-4 p-4 text-sm">
              <div className="text-gray-600">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenReplaceModal(item)}
                    className="text-sm font-medium cursor-pointer hover:text-blue-600"
                  >
                    x{item.quantity} {item.name}
                  </div>
                ))}
              </div>
              <div className="font-semibold">{formatPrice(subtotal)}</div>
              {/* <div>{formatPrice(downpayment)}</div> */}
              <div className="text-center">{formatPrice(subtotal)}</div>
              <div className="text-center">{formatPrice(subtotal/6)}</div>
              <div className="text-center">{formatPrice(subtotal/12)}</div>
              {/* <div className="text-center">{formatPrice(subtotal/24)}</div> */}
            </div>
            
            {/* Radio Button Row */}
            <div className="grid grid-cols-5 gap-4 p-4 pb-16 items-center border-b border-[#060B16]/50">
              <div></div>
              <div></div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setSelectedPayment('one-time')
                    setPayment(1)
                    localStorage.setItem("payment", 'one-time');
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === 'one-time'
                      ? 'bg-onpoint-btnblue border-onpoint-btnblue'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === 'one-time' && (<Check className="text-white w-4 h-4"/> )}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setSelectedPayment('6-months'), 
                    setPayment(6),
                    localStorage.setItem("payment", '6-months');
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === '6-months'
                      ? 'bg-onpoint-btnblue border-onpoint-btnblue'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === '6-months' && (<Check className="text-white w-4 h-4"/> )}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setSelectedPayment('12-months'), 
                    setPayment(12),
                    localStorage.setItem("payment", '12-months');
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === '12-months'
                      ? 'bg-onpoint-btnblue border-onpoint-btnblue'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === '12-months' && (<Check className="text-white w-4 h-4"/> )}
                </button>
              </div>
              {/* <div className="flex justify-center">
                <button
                  onClick={() => {
                    setSelectedPayment('24-months'),
                    setPayment(24),
                    localStorage.setItem("payment", '24-months');
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === '24-months'
                      ? 'bg-onpoint-btnblue border-onpoint-btnblue'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === '24-months' && (<Check className="text-white w-4 h-4"/> )}
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex justify-start items-center mb-12 gap-10">
          <div>
            <p className="text-lg text-gray-700 mb-2">{selectedPayment === 'one-time' ? 'One time payment' : (selectedPayment === '6-months' ? 'For 6 Months' : (selectedPayment === '12-months' ? 'For 12 Months' : (selectedPayment === '24-months' ? 'For 24 Months' : '')))} :</p>
            <p className="text-4xl font-bold text-onpoint-btnblue">
              {selectedPayment === 'one-time' ? formatPrice(subtotal) : formatPrice(subtotal/payment) }
            </p>
          </div>
        </div>

        {showReplaceModal && selectedItem && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-[500px] max-h-[80vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header (fixed) */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">
                  Replace {selectedItem.name}
                </h2>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {replacementProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images[0]?.image_path}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-600">
                          ₱{p.discount_price || p.price}
                        </p>
                      </div>
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={replacementSelections[p.id] || 0}
                      onChange={(e) => handleQuantityChange(p.id, parseInt(e.target.value))}
                      className="w-16 border rounded-md px-2 py-1 text-center"
                    />
                  </div>
                ))}
              </div>

              {/* Footer (fixed) */}
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowReplaceModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReplacement}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Replace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}



      </motion.div >
      <footer className="w-full fixed bottom-0 bg-white shadow-[0_-1px_1px_rgba(0,0,0,0.1)] py-6">
        <div className="max-w-[1480px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <Link 
              href="/shopping-cart"
              className={`px-12 py-3 text-base font-medium rounded-lg transition-all ${
                "bg-transparent hover:bg-blue-950 hover:text-white text-onpoint-btnblue font-semibold border border-onpoint-btnblue" 
              }`}
            >
              Back
            </Link>
            <Link 
                href="/review-order"
                className={`px-12 py-3 text-base font-medium rounded-lg transition-all bg-onpoint-btnblue hover:bg-onpoint-dark-blue/90 text-white
                }`}
                >
                Continue
            </Link>
        </div>
    </footer>
    </AuthenticatedLayout>
  );
};

export default PaymentTerms;