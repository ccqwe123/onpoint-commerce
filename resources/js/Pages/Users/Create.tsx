import { useForm } from "@inertiajs/react";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Header from "@/Components/Header";
import { User } from "@/types/User";
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

interface Props {
  user: User;
}

export default function CreateProduct({ user }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, setData, post, put, processing, errors, reset } = useForm<User>({
        id: 0,
        name: "",
        email: "",
        position: "",
        user_type: "",
        password: "",
        password_confirmation: "",
        is_active: true,
    });
  
  const openConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleInputChange = (e: React.FormEvent) => {
    e.preventDefault();
  }

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    post(`/users/store`, {
        preserveScroll: true,
        onSuccess: () => {
        reset();
        (window as any).showToast("User created successfully.", "success");
        setUploadedFiles([]);
        },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
        <Header />
         <form className="px-4 py-12">
            <div className=" bg-card">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold flex items-center gap-2">
                            <Link href={`/users`} className="flex items-center text-gray-500 hover:text-gray-700">
                                <ChevronLeft size={28} className="mr-1" />
                            </Link>
                            <span className="cursor-default select-none text-2xl font-semibold">Create User</span>
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
                                <CardTitle className="text-[22px] font-medium">User Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="name">Full Name</Label>
                                        <Input id="name" value={data.name} onChange={e => setData("name", e.currentTarget.value)} placeholder="Enter Full Name" />
                                        {errors.name && <div className="text-red-600">{errors.name}</div>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="email">Email Address</Label>
                                        <Input id="email" value={data.email} onChange={e => setData("email", e.currentTarget.value)} placeholder="user@mail.com" />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="position">Position Name</Label>
                                        <Input id="position" value={data.position || ""} onChange={e => setData("position", e.currentTarget.value)} placeholder="Manager" />
                                        {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="status">User Type</Label>
                                        <Select value={data.user_type}  onValueChange={(val: "admin" | "manager" | "staff") => setData("user_type", val)} >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select User Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="staff">Staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.user_type && <p className="text-red-500 text-sm">{errors.user_type}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="password">Password</Label>
                                        <Input type="password" id="password" value={data.password} onChange={e => setData("password", e.currentTarget.value)} placeholder="Password" />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium" htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input type="password" id="confirmPassword" value={data.password_confirmation} onChange={e => setData("password_confirmation", e.currentTarget.value)} placeholder="Confirm your password" />
                                        {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
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
                                </div>
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
                        Are you sure you want to create this user?
                    </p>

                    <div className="flex justify-end gap-4">
                        <button
                        onClick={(e) => {
                            setShowModal(false);
                            e.preventDefault();
                        }}
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
    </div>
  );
}
