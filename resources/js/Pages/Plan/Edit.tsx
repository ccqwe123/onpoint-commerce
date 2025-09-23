import { useForm } from "@inertiajs/react";
import React, { useState, useEffect } from 'react';
import Header from "@/Components/Header";
import { PlanData } from "@/types/Plan";
import { ChevronLeft } from 'lucide-react';
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  plan: PlanData;
}

export default function EditPlan({ plan }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    name: plan.name,
    price: plan.price ?? "",
    is_active: plan.is_active,
    descriptions: plan.descriptions,
  });

  const openConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };
  const addFeature = () => {
    if (
        data.descriptions.length === 0 || 
        data.descriptions[data.descriptions.length - 1].name.trim() !== ""
    ) {
        setData("descriptions", [
        ...data.descriptions,
        { id: null, name: "" }, // add new empty input
        ]);
    }
    };

  const updateFeature = (index: number, value: string) => {
    const updated = [...data.descriptions];
    updated[index].name = value;
    setData("descriptions", updated);
  };

  const removeFeature = (index: number) => {
    setData(
      "descriptions",
      data.descriptions.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    put(`/plan/${plan.id}`, {
        onSuccess: () => {
        setShowModal(false);
        setLoading(false);
        (window as any).showToast("Plan updated successfully ✅", "success");
        },
        onError: () => {
        setLoading(false);
            (window as any).showToast("Failed to update plan ❌", "error");
            setShowModal(false);
        },
        onFinish: () => {
        setLoading(false);
        },
    });
};


  return (
    <div className="min-h-screen flex flex-col bg-white">
        <Header />
         <main className="px-4 py-12">
            <form onSubmit={openConfirmModal} className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold flex items-center gap-2">
                        <Link href="/plans" className="flex items-center text-gray-500 hover:text-gray-700">
                            <ChevronLeft size={28} className="mr-1" />
                        </Link>
                        <span className="cursor-default select-none">Edit Plan</span>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="space-y-8 max-w-2xl">
                    <div>
                        <h2 className="text-lg font-medium mb-4">General Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={data.is_active ? "Active" : "Inactive"}
                                onChange={(e) => setData("is_active", e.target.value === "Active")}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                    <h2 className="text-lg font-medium mb-4">Plan Features</h2>
                    {data.descriptions.map((desc, index) => (
                        <div key={index} className="flex items-center gap-3 mb-2">
                        <input
                            type="text"
                            value={desc.name}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder={`Feature ${index + 1}`}
                            className="flex-1 rounded-md border-gray-300 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md"
                        >
                            Delete
                        </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFeature}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Add new feature
                    </button>
                    </div>

                    {/* Pricing */}
                    <div>
                    <h2 className="text-lg font-medium mb-4">Pricing</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Base Price</label>
                        <input
                        type="number"
                        value={data.price || ""}
                        onChange={(e) => setData("price", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    </div>

                    {/* Submit */}
                    
                </div>
            </form>
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                        key="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed min-h-screen inset-0 flex items-center justify-center bg-black/50 z-50"
                        >
                        <motion.div
                            key="modal-content"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white rounded-2xl p-8 w-[400px] shadow-lg"
                        >
                            <h2 className="text-xl font-bold mb-4">Confirm Update</h2>
                            <p className="text-gray-600 mb-6">
                            Are you sure you want to update this plan?
                            </p>

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
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Confirm"}
                            </button>
                            </div>
                        </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
  );
}
