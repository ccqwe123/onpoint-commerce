import Header from "@/Components/Header";
import React, { useState, useEffect } from 'react';
import { Category, Product, ProductImage } from "@/types/Product";
import { useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/Button';
import { FileUpload, UploadedFile } from '@/Components/ui/file-upload-edit';
import { RichTextEditor } from '@/Components/ui/rich-text-editor';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types"; 
import { Head } from '@inertiajs/react';


interface ProductFormData {
  name: string;
  status: string;
  description: string;
  price: string;
  discount_price: string;
  stock: string;
  images: (ProductImage | number | File)[];
}

interface Props {
  category: Category;
  product: Product;
  onSave?: (data: ProductFormData, images: (ProductImage | UploadedFile)[]) => void;
}

type ProductEditProps = PageProps & Props;

export default function ProductList({ category, product, auth }: ProductEditProps) {
    const [showModal, setShowModal] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const { data, setData, post, put, errors, processing } = useForm<ProductFormData>({
        name: product.name,
        status: product.is_active ? '1' : '0',
        description: product.description,
        price: product.price,
        discount_price: product.discount_price,
        stock: product.stock.toString(),
        images: product.images,
    });
    const handleInputChange = (field: keyof typeof data) => (value: string) => {
        setData(field, value);
    };
    const handleFilesAdded = (newFiles: UploadedFile[]) => {
        setUploadedFiles(prev => {
            const existingIds = new Set(prev.map(f => f.id));
            const filesToAdd = newFiles.filter(f => !existingIds.has(f.id));
            const updatedFiles = prev.map(existing => {
                const updated = newFiles.find(f => f.id === existing.id);
                return updated || existing;
            });
            const combined = [...updatedFiles, ...filesToAdd];

            // ✅ store only `File` objects and existing image IDs
            setData("images", [
                ...existingImages.map(img => img.id), 
                ...combined.map(f => f.file) 
            ]);

            return combined;
        });
    };

    const handleFileRemoved = (fileId: string) => {
        setUploadedFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);

            setData("images", [
                ...existingImages.map(img => img.id),
                ...updated.map(f => f.file)
            ]);

            return updated;
        });
    };
    const handleExistingImageRemoved = (imageId: number) => {
        setExistingImages(prev => {
            const updated = prev.filter(img => img.id !== imageId);

            setData("images", [
                ...updated.map(img => img.id),
                ...uploadedFiles.map(f => f.file)
            ]);

            return updated;
        });
    };

    const handleImagesReordered = (reorderedImages: (ProductImage | UploadedFile)[]) => {
        const existingImgs = reorderedImages.filter(
            (img): img is ProductImage => "product_id" in img
        );
        const newFiles = reorderedImages.filter(
            (img): img is UploadedFile => "file" in img
        );

        setExistingImages(existingImgs);
        setUploadedFiles(newFiles);

        // ✅ only IDs and Files get sent
        setData("images", [
            ...existingImgs.map(img => img.id),
            ...newFiles.map(f => f.file),
        ]);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const allImages = [...existingImages, ...uploadedFiles];

        // const formData = new FormData();
        // formData.append('name', data.name);
        // formData.append('status', data.status);
        // formData.append('description', data.description);
        // formData.append('price', data.price);
        // formData.append('discount_price', data.discount_price || '');
        // formData.append('stock', data.stock);

        // allImages.forEach((img) => {
        //     if ("file" in img) {
        //         // only send the file, not an object
        //         formData.append("images[]", img.file as File);
        //     } else {
        //         formData.append("existing_images[]", img.id.toString());
        //     }
        // });

        // Use `post` or `put` with a FormData callback
        post(`/product/${product.id}/update`, {
            preserveScroll: true,
            onSuccess: () => {
                (window as any).showToast("Product updated successfully!", "success");
                setUploadedFiles([]);
                setExistingImages([]);
                setFormErrors({});
                setShowModal(false);
            },
            onError: (err) => {
                console.log("Validation errors:", err);
                (window as any).showToast("Failed to update product", "error");
                setShowModal(false);
            },
            forceFormData: true,
            // tell Inertia to send FormData instead of JSON
            // data: formData
        });
    };


    const openConfirmModal = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };
    return (
        <>
        <Head title="OnPoint | Edit Product" />
            <AuthenticatedLayout user={auth.user}>
                <form className="px-4 py-12">
                    <div className=" bg-card">
                        <div className="container mx-auto px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-semibold flex items-center gap-2">
                                    <Link href={`/category/${category.id}/product-list`} className="flex items-center text-gray-500 hover:text-gray-700">
                                        <ChevronLeft size={28} className="mr-1" />
                                    </Link>
                                    <span className="cursor-default select-none text-2xl font-semibold">Edit Product</span>
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
                                                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-base font-medium" htmlFor="status">Status</Label>
                                                <Select value={data.status} onValueChange={handleInputChange('status')} >
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
                                        <RichTextEditor value={data.description} onChange={handleInputChange('description')} placeholder="Enter product features and description..." />
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
                                                    onChange={(e) => handleInputChange('price')(e.target.value)} />
                                                {errors.price && <div className="text-red-600">{errors.price}</div>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="discount-price">Discount Price</Label>
                                                <Input id="discount-price" placeholder="0.00" type="number" step="0.01"  
                                                    value={data.discount_price}
                                                    onChange={(e) => handleInputChange('discount_price')(e.target.value)} />
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
                                            onFilesReordered={(files) => handleImagesReordered(files)}
                                            uploadedFiles={uploadedFiles}
                                            existingImages={existingImages}
                                            onExistingImageRemoved={handleExistingImageRemoved}
                                            accept="image/*"
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
                                onClick={handleSave}
                                disabled={processing}
                                className="px-6 py-2 rounded-lg bg-onpoint-btnblue text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                {processing ? "Updating..." : "Update"}
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
