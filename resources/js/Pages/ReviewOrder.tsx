import React, { useState, useEffect } from 'react';
import Header from "@/Components/Header";
import { Check } from 'lucide-react';
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Product } from "@/types/Product";
import { Plan } from "@/types/Plan";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewOrderProps {
  onContinue: () => void;
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({ onContinue }) => {
    const [cart, setCart] = useState<Record<number, number>>({});
    const [plans, setPlans] = useState<Plan | null>(null);
    const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState('');

    const handleSubmit = async () => {
        if (!plans) return;
        setLoading(true);
        try {
            await axios.post("/api/orders", {
            plan_id: plans.id,
            cart: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.discount_price || item.price,
            })),
            subtotal,
            payment
            });

            localStorage.removeItem("cart");
            localStorage.removeItem("selectedPlan");
            localStorage.removeItem("payment");

            window.location.href = "/thank-you";
        } catch (err) {
            console.error("Failed to submit order", err);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        const payment = localStorage.getItem("payment");
        const parsed = saved ? JSON.parse(saved) : {};
        setPayment(payment || "");
        setCart(parsed);
    }, []);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const savedPlan = localStorage.getItem("selectedPlan");
                const parsedPlan = savedPlan ? Number(savedPlan) : null;
                const res = await axios.get("/api/plan/" + parsedPlan);
                const plan = res.data;
                const mappedPlan: Plan = {
                    id: plan.id,
                    name: plan.name,
                    price: plan.price,
                    discount_price: plan.discount_price,
                    type: plan.type,
                    is_active: plan.is_active,
                    descriptions: plan.descriptions?.map((d: any) => d.name) || [],
                };
                setPlans(mappedPlan);
            } catch (err) {
                console.error("Failed to fetch plan", err);
            }
        };

        fetchPlans();
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
            className="relative min-h-screen flex flex-col bg-gray-50">
        <Header/>
        <main className="flex-1 px-16">
        <div className="max-w-[1480px] mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2">Review your Quotation</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Please check all details before submitting.</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 mb-12 lg:px-15">
            {plans && (
                <div className="px-16 border-r border-black/50">
                    <div className="text-center text-onpoint-btnblue text-2xl font-semibold py-10">Software</div>
                    
                        <div
                            className={`relative cursor-pointer rounded-xl p-6 transition-all duration-200 bg-gradient-to-b from-[#0026AB] to-[#000518] text-white`}>
                            <h3 className="text-2xl font-medium">{plans.name}</h3>
                            <p className="text-4xl font-semibold">
                                {plans.type === "custom"
                                    ? "Custom"
                                    : `P${parseFloat(plans.price || plans.discount_price || "0").toLocaleString('en-PH', { minimumFractionDigits: 2 })} /mo`}
                            </p>
                        </div>
                    <div className="py-10 px-2">
                        <div className="space-y-3">
                            {plans.descriptions.map((desc, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-onpoint-btnblue" />
                                <span className="text-sm leading-relaxed">{desc}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
                <div className="px-16">
                    <div className="text-center text-onpoint-btnblue text-2xl font-semibold py-10">Hardware</div>
                    <div
                        className={`relative cursor-pointer rounded-xl p-6 transition-all duration-200 bg-gradient-to-b from-[#0026AB] to-[#000518] text-white`}>
                        <h3 className="text-2xl font-medium">OnPoint Devices</h3>
                        <p className="text-4xl font-semibold">{formatPrice(subtotal)}</p>
                    </div>
                    <div className="py-6">
                        {cartItems.map((item) => (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-0 py-1.5 px-2">
                                <div className="text-base font-semibold">{item.category?.name}</div>
                                <div className="text-center">x{item.quantity}</div>
                                <div className="">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
        </main>
        <footer className="w-full bg-white shadow-[0_-1px_1px_rgba(0,0,0,0.1)] py-6 fixed bottom-0">
            <div className="max-w-[1480px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                <div>
                    <span className="text-black font-semibold text-3xl">6 Months : </span>
                    <span className="text-onpoint-btnblue font-semibold text-3xl">P7,400.00</span>
                </div>
                <div className="flex flex-row gap-4">
                    <Link 
                    href="/payment-terms"
                    className={`px-12 py-3 text-base font-medium rounded-lg transition-all ${
                        "bg-transparent hover:bg-blue-950 hover:text-white text-onpoint-btnblue font-semibold border border-onpoint-btnblue" 
                    }`}
                    >
                    Back
                    </Link>
                    <button 
                        onClick={() => setShowModal(true)}
                        className={`px-12 py-3 text-base font-medium rounded-lg transition-all bg-onpoint-btnblue hover:bg-onpoint-dark-blue/90 text-white
                        }`}
                        >
                        Finish
                    </button>

                </div>
            </div>
        </footer>
        <AnimatePresence>
            {showModal && (
                <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                <motion.div
                    key="modal-content"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl p-8 w-[400px] shadow-lg"
                >
                    <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
                    <p className="text-gray-600 mb-6">Are you sure you want to submit your order?</p>
                    <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 rounded-lg bg-onpoint-btnblue text-white hover:bg-onpoint-dark-blue disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

    </motion.div>
  );
};

export default ReviewOrder;