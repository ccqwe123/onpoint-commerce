import Header from "@/Components/Header";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Category } from "@/types/Product";
import PaginationWithSearch from "@/Components/PaginationWithSearch";
import { Paginated } from "@/types/Pagination";
import { Link } from "@inertiajs/react";
import Status from "@/Components/Modals/Status";
import { useForm } from "@inertiajs/react";
import { Card } from '@/Components/ui/card';

interface PlansPageProps {
  categories: Paginated<Category>;
  filters: {
    search?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
  };
}

export default function ProductCategory({ categories: initialCategories, filters }: PlansPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowFormModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [search, setSearch] = useState(filters.search || "");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [categories, setCategories] = useState<Paginated<Category>>(initialCategories);
    const { data, setData, post, put, processing, errors, reset } = useForm<Category>({
        id: 0,
        name: "",
        is_active: true,
    });

    const nextSortDirection = (column: string) => {
        if (filters.sort_by === column) {
        return filters.sort_direction === "asc" ? "desc" : "asc";
        }
        return "asc";
    };
    

    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetch(`/api/categories?search=${debouncedSearch}&sort_by=${filters.sort_by}&sort_direction=${filters.sort_direction}`)
        .then((res) => res.json())
        .then((data) => setCategories(data));
    }, [debouncedSearch, filters.sort_by, filters.sort_direction]);
    
    const togglePlan = (category: Category) => {
        setSelectedCat(category);
        setShowModal(true);
    };

    const confirmToggle = () => {
       if (!selectedCat) return;

        put(`/product-categories/${selectedCat.id}/toggle`, {
        data: { is_active: !selectedCat.is_active },
        onSuccess: () => {
            setShowModal(false);
            setCategories((prev) => ({
                ...prev,
                data: prev.data.map((p) =>
                p.id === selectedCat.id ? { ...p, is_active: !selectedCat.is_active } : p
                ),
            }));
            (window as any).showToast("Category updated successfully ✅", "success");
        },
        onError: () => {
            (window as any).showToast("Failed to update plan ❌", "error");
        },
        onFinish: () => {
            setShowModal(false);
        },
        });
    };
    const handleCreate = () => {
        setEditingCategory(null);
        reset();
        setShowFormModal(true);
    };
    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        setData("name", cat.name);
        setData("is_active", !!cat.is_active);
        setShowFormModal(true);
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: data.name,
            is_active: data.is_active ? 1 : 0,
        };

        if (editingCategory) {
            put(`/product-categories/${editingCategory.id}`, {
            data: payload,
            onSuccess: () => {
                (window as any).showToast("Category updated", "success");
                setShowFormModal(false);
            },
            onError: () => {
                (window as any).showToast("Failed to update", "error");
            },
            });
        } else {
            post(`/product-categories`, {
            data: payload,
            onSuccess: () => {
                (window as any).showToast("Category created", "success");
                setShowFormModal(false);
                reset();
            },
            onError: () => {
                (window as any).showToast("Failed to create", "error");
            },
            });
        }
        };


  return (
    <div className="min-h-screen flex flex-col bg-white">
        <Header />
         <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Product Categories</h1>
                    
    
                    <div className="flex gap-2">
                        <div className="max-w-md mx-auto">
                            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"> Search </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" value={search} onChange={(e)=> setSearch(e.target.value)} id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
                            </div>
                        </div>
                        <button onClick={() => handleCreate()} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center float-right">
                            Add Category
                        </button>

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

                                <form onSubmit={submit} className="space-y-4">
                                        <div>
                                        <label className="block text-sm font-medium">Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                        </div>

                                        <div className="flex items-center gap-2">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                        />
                                        <label htmlFor="is_active">Active</label>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-lg border">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 rounded-lg bg-onpoint-btnblue text-white" disabled={processing}>
                                            {editingCategory ? "Update" : "Create"}
                                        </button>
                                        </div>
                                    </form>
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
                                <th className="px-6 py-3 cursor-pointer w-[50%]">
                                    <Link
                                        href="/product-categories"
                                        data={{
                                            ...filters,
                                            sort_by: "name",
                                            sort_direction: nextSortDirection("name"),
                                        }}
                                        preserveState
                                        replace
                                        >
                                        <span className="inline-flex items-center">
                                            Category name
                                            {filters.sort_by === "name" &&
                                            (filters.sort_direction === "asc" ? (
                                                <ArrowUp className="ml-1 w-3 h-3" />
                                            ) : (
                                                <ArrowDown className="ml-1 w-3 h-3" />
                                            ))}
                                        </span>
                                    </Link>
                                </th>
                                <th className="px-6 py-3 cursor-pointer w-[20%]">
                                    <Link href="/product-categories" 
                                    data={{
                                        ...filters,
                                        sort_by: "is_active",
                                        sort_direction: nextSortDirection("is_active"),
                                    }} 
                                    preserveState replace>
                                    <span className="inline-flex items-center"> Status {filters.sort_by === "is_active" && (filters.sort_direction === "asc" ? (
                                        <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                        <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                    </span>
                                    </Link>
                                </th>
                                <th className="px-6 py-3 w-full">Actions</th>
                            </tr>
                        </thead>
                        <tbody> {categories.data.map((category) => ( <tr key={category.id} className="odd:bg-[#fafafa] even:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"> {category.name} </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className={`absolute inline-flex h-full w-full rounded-full ${category.is_active ? 'bg-green-400' : 'bg-red-400'} opacity-75 animate-ping`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${category.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.is_active ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} `}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Link href={`/category/${category.id}/product-list`} className="text-black bg-white hover:bg-green-100 hover:text-black border border-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2"> Add Product </Link>
                                <button onClick={() => openEdit(category)} className="text-black bg-white hover:bg-blue-100 hover:text-black border border-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2"> Edit </button>
                                {category.is_active ? ( 
                                    <button onClick={() => togglePlan(category)} className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2"> Set as Inactive </button> ) : ( 
                                    <button onClick={() => togglePlan(category)} className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2"> Set as Active </button> 
                                )}
                            </td>
                        </tr> ))} </tbody>
                    </table>
                    <div className="px-5 py-3">
                        <PaginationWithSearch
                            current_page={categories.current_page}
                            last_page={categories.last_page}
                            links={categories.links}
                            onPageChange={(url) => {
                                fetch(url)
                                .then(res => res.json())
                                .then(data => setCategories(data));
                            }}
                        />
                    </div>
                </Card>
                 <Status
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmToggle}
                    isActive={selectedCat?.is_active ?? false}
                    type="Product"
                />
            </div>
        </main>
    </div>
  );
}
