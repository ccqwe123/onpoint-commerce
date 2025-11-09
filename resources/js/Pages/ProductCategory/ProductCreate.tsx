import { useForm } from "@inertiajs/react";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Header from "@/Components/Header";
import { Category } from "@/types/Product";
import { ChevronLeft, Save } from 'lucide-react';
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from '@/Components/ui/rich-text-editor';
import { FileUpload, UploadedFile } from '@/Components/ui/file-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/Button';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types"; 
import { Head } from '@inertiajs/react';

interface Props {
  category: Category;
}

type ProductCreateProps = PageProps & Props;

export default function CreateProduct({ category, auth }: ProductCreateProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    status: "active",
    description: "",
    price: "",
    discount_price: "",
    category_id: category.id,
    images: [] as File[],
  });
  
  const openConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleInputChange = (e: React.FormEvent) => {
    e.preventDefault();
  }
  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setUploadedFiles(prev => {
      const existingIds = new Set(prev.map(f => f.id));
      const filesToAdd = newFiles.filter(f => !existingIds.has(f.id));
      const updatedFiles = prev.map(existing => {
        const updated = newFiles.find(f => f.id === existing.id);
        return updated || existing;
      });
      const finalFiles = [...updatedFiles, ...filesToAdd];
      setData("images", finalFiles.map(f => f.file));
        return finalFiles;
    });
  };
  const handleFileRemoved = (fileId: string) => {
    setUploadedFiles(prev => {
        const remainingFiles = prev.filter(f => f.id !== fileId);
        setData("images", remainingFiles.map(f => f.file)); // sync useForm
        return remainingFiles;
    });
  };
  const handleFilesReordered = (reorderedFiles: UploadedFile[]) => {
    setUploadedFiles(reorderedFiles);
    setData("images", reorderedFiles.map(f => f.file));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    post(`/product/${category.id}/store`, {
        preserveScroll: true,
        onSuccess: () => {
        reset();
        (window as any).showToast("Product created successfully.", "success");
        setUploadedFiles([]);
        },
    });
  };

  return (
    <>
        <Head title="OnPoint | Create Product" />
        <AuthenticatedLayout user={auth.user}>
         <form className="px-4 py-12">
            <div className=" bg-card">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold flex items-center gap-2">
                            <Link href={`/category/${category.id}/product-list`} className="flex items-center text-gray-500 hover:text-gray-700">
                                <ChevronLeft size={28} className="mr-1" />
                            </Link>
                            <span className="cursor-default select-none text-2xl font-semibold">Add Product</span>
                        </div>
                        <Button onClick={openConfirmModal} className="gap-2 bg-onpoint-btnblue hover:bg-blue-500">
                            <Save className="h-4 w-4" /> Save
                        </Button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div>
                            <CardHeader>
                                <CardTitle className="text-[22px] font-medium">General Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="product-name">Product Name</Label>
                                        <Input id="product-name" value={data.name} onChange={e => setData("name", e.currentTarget.value)} placeholder="Enter product name" />
                                        {errors.name && <div className="text-red-600">{errors.name}</div>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={val => setData("status", val)} >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="1">Active</SelectItem>
                                                <SelectItem value="0">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <div className="text-red-600">{errors.status}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                        
                        <div>
                            <CardHeader className="py-2">
                                <Label className="text-[22px] font-medium">Product Features</Label>
                            </CardHeader>
                            <CardContent className="!pb-0 block h-[270px]">
                                <RichTextEditor value={data.description} onChange={val => setData("description", val)} placeholder="Enter product features and description..." />
                            </CardContent>
                            <div className="px-6 pb-4">
                                {errors.description && <div className="text-red-600">{errors.description}</div>}
                            </div>
                        </div>
                        <div>
                            <CardHeader className="py-2">
                                <CardTitle className="text-lg font-medium">Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="base-price">Base Price</Label>
                                        <Input id="base-price" placeholder="0.00" type="number" step="0.01" 
                                            value={data.price}
                                            onChange={e => setData("price", e.currentTarget.value)} />
                                        {errors.price && <div className="text-red-600">{errors.price}</div>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount-price">Discount Price</Label>
                                        <Input id="discount-price" placeholder="0.00" type="number" step="0.01"  
                                            value={data.discount_price}
                                            onChange={e => setData("discount_price", e.currentTarget.value)} />
                                        {errors.discount_price && <div className="text-red-600">{errors.discount_price}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">Product Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileUpload 
                                    onFilesAdded={handleFilesAdded} 
                                    onFileRemoved={handleFileRemoved} 
                                    onFilesReordered={handleFilesReordered} 
                                    uploadedFiles={uploadedFiles} accept="image/*" 
                                    maxSize={10} 
                                    multiple={true} 
                                />
                            </CardContent>
                        </div>
                    </div>
                </div>
            </div>
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
                    className="bg-white rounded-2xl p-8 w-[450px] shadow-lg"
                    >
                    <h2 className="text-xl font-bold mb-4">Confirm Create</h2>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to create this product?
                    </p>

                    <div className="flex justify-end gap-4">
                        <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="px-6 py-2 rounded-lg bg-onpoint-btnblue text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                        {processing ? "Creating..." : "Confirm"}
                        </button>
                    </div>
                    </motion.div>
                </motion.div>
                )}
            </AnimatePresence>
        </form>
    </AuthenticatedLayout>
    </>
  );
}
