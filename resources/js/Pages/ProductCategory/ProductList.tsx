import Header from "@/Components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Category, Product } from "@/types/Product";
import Pagination from "@/Components/Pagination";
import { Paginated } from "@/types/Pagination";
import { ChevronLeft } from 'lucide-react';
import { Link } from "@inertiajs/react";
import Status from "@/Components/Modals/Status";
import { Card } from '@/Components/ui/card';

interface Props {
  category: Category;
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function ProductList({ category, products }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowFormModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Product | null>(null);
    const [selectedCat, setSelectedCat] = useState<Product | null>(null);
    // const { data, setData, post, put, processing, errors, reset } = useForm<Product>({
    //     id: 0,
    //     name: "",
    //     is_active: true,
    // });
    // const togglePlan = (category: Product) => {
    //     setSelectedCat(category);
    //     setShowModal(true);
    // };

    const confirmToggle = () => {
       if (!selectedCat) return;

        // put(`/product-categories/${selectedCat.id}/toggle`, {
        //     data: { is_active: !selectedCat.is_active },
        //     onSuccess: () => {
        //         setShowModal(false);
        //         (window as any).showToast("Cate updated successfully ✅", "success");
        //     },
        //     onError: () => {
        //         (window as any).showToast("Failed to update plan ❌", "error");
        //     },
        //     onFinish: () => {
        //         setShowModal(false);
        //     },
        // });
    };
    // const handleCreate = () => {
    //     setEditingCategory(null);
    //     reset();
    //     setShowFormModal(true);
    // };
    // const openEdit = (cat: Category) => {
    //     setEditingCategory(cat);
    //     setData("name", cat.name);
    //     setData("is_active", !!cat.is_active);
    //     setShowFormModal(true);
    // };
    const submit = (e: React.FormEvent) => {
        
    };


  return (
    <div className="min-h-screen flex flex-col bg-white">
        <Header />
         <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-semibold flex items-center gap-2">
                        <Link href="/product-categories" className="flex items-center text-gray-500 hover:text-gray-700">
                            <ChevronLeft size={28} className="mr-1" />
                        </Link>
                        <span className="cursor-default select-none">{category.name}</span>
                    </div>
                    <div >
                        <Link href={`/product/${category.id}/create`} className="text-black border border-gray-400 bg-white hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center float-right">
                            Add Product
                        </Link>

                        <AnimatePresence>
                            {showCreateModal && (
                                <motion.div
                                    key="backdrop"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                >
                                    <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    className="bg-white rounded-xl p-6 w-[400px] shadow-lg"
                                    >
                                    <h2 className="text-xl font-semibold mb-4">
                                        {editingCategory ? "Edit Category" : "Create Category"}
                                    </h2>

                                
                                </motion.div>
                            </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <Card className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-[50%]">Product name</th>
                            <th className="px-6 py-3 w-[20%]">Status</th>
                            <th className="px-6 py-3 w-full">Actions</th>
                        </tr>
                        </thead>
                        <tbody> {products.data.map((product) => ( <tr key={product.id} className="odd:bg-[#fafafa] even:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"> {product.name} </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className={`absolute inline-flex h-full w-full rounded-full ${product.is_active ? 'bg-green-400' : 'bg-red-400'} opacity-75 animate-ping`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${product.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_active ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} `}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Link href={`/category/${category.id}/product/${product.id}`} className="text-black bg-white hover:bg-blue-100 hover:text-black border border-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2"> Edit </Link>
                                {product.is_active ? ( 
                                    <button className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2"> Set as Inactive </button> ) : ( 
                                    <button className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2"> Set as Active </button> 
                                )}
                            </td>
                        </tr> ))} </tbody>
                        <div className="px-5 py-3">
                            <Pagination
                                current_page={products.current_page}
                                last_page={products.last_page}
                                links={products.links}
                            />
                        </div>
                    </table>
                </Card>
                 <Status
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmToggle}
                    isActive={ false}
                />
            </div>
        </main>
    </div>
  );
}
