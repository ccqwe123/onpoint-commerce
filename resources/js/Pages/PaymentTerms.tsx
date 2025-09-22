import { useEffect, useState } from "react";
import Header from "@/Components/Header";
import { Check } from 'lucide-react';
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Product } from "@/types/Product";
import { motion } from "framer-motion";

interface PaymentTermsProps {
  onContinue: () => void;
}

const PaymentTerms: React.FC<PaymentTermsProps> = ({ onContinue }) => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [payment, setPayment] = useState(0);
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<'one-time' | '6-months' | '12-months' | '24-months'>('one-time');

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    const parsed = saved ? JSON.parse(saved) : {};
    setCart(parsed);
  }, []);

  useEffect(() => {
    const payment = localStorage.getItem("payment");
    if (
      payment === "one-time" ||
      payment === "6-months" ||
      payment === "12-months" ||
      payment === "24-months"
    ) {
      setSelectedPayment(payment);
    } else {
      localStorage.setItem("payment", "one-time");
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="relative min-h-screen bg-white">
      <Header/>
      <div className="max-w-[1480px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">STEP 3 OF 3</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Choose your payment terms.</h1>
        </div>

        {/* Add-ons Table */}
        <div className="mb-8">
          <div className="bg-gray-900 text-white px-4 py-3 font-semibold">
            ADD ONS
          </div>
          
          <div className="">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 p-4 text-sm font-medium text-gray-700">
              <div className="text-base font-semibold">Device</div>
              <div className="text-base font-semibold">Price</div>
              <div className="text-base font-semibold">Downpayment</div>
              <div className="text-center text-base font-semibold">One Time</div>
              <div className="text-center text-base font-semibold">6 mos.</div>
              <div className="text-center text-base font-semibold">12 mos.</div>
              <div className="text-center text-base font-semibold">24 mos.</div>
            </div>
            
            {/* Table Row */}
            <div className="grid grid-cols-7 gap-4 p-4 text-sm">
              <div className="text-gray-600">
                {cartItems.map((item) => (
                  <div key={item.id} className="text-sm font-medium">x{item.quantity} {item.name}</div>
                ))}
              </div>
              <div className="font-semibold">{formatPrice(subtotal)}</div>
              <div>{formatPrice(downpayment)}</div>
              <div className="text-center">{formatPrice(subtotal)}</div>
              <div className="text-center">{formatPrice(subtotal/6)}</div>
              <div className="text-center">{formatPrice(subtotal/12)}</div>
              <div className="text-center">{formatPrice(subtotal/24)}</div>
            </div>
            
            {/* Radio Button Row */}
            <div className="grid grid-cols-7 gap-4 p-4 pb-16 items-center border-b border-[#060B16]/50">
              <div></div>
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
              <div className="flex justify-center">
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
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex justify-start items-center mb-12 gap-10">
          <div>
            <p className="text-lg text-gray-700 mb-2">{selectedPayment === 'one-time' ? 'One time payment:' : (selectedPayment === '6-months' ? 'For 6 Months:' : (selectedPayment === '12-months' ? 'For 12 Months:' : (selectedPayment === '24-months' ? 'For 24 Months:' : '')))} :</p>
            <p className="text-4xl font-bold text-onpoint-btnblue">
              {selectedPayment === 'one-time' ? formatPrice(subtotal) : formatPrice(subtotal/payment) }
            </p>
          </div>
        </div>
      </div>
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
    </motion.div>
  );
};

export default PaymentTerms;