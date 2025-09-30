import PaginationWithSearch from "@/Components/PaginationWithSearch";
import { motion, AnimatePresence } from "framer-motion";
import { Paginated } from "@/types/Pagination";
import { Link } from "@inertiajs/react";
import { User } from "@/types/User";
import { Card } from '@/Components/ui/card';
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from 'lucide-react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { PageProps } from "@/types";

interface OrderProps {
  users: Paginated<User>;
  filters: {
    search?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
  };
}
type Props = PageProps & OrderProps;

export default function Home({ auth, users: innitialOrders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [showFormModal, setShowFormModal] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [users, setUsers] = useState<Paginated<User>>(innitialOrders);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm<User>({
        id: 0,
        name: "",
        email: "",
        position: "",
        user_type: "",
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
        fetch(`/api/users?search=${debouncedSearch}&sort_by=${filters.sort_by || "id"}&sort_direction=${filters.sort_direction || "asc"}`)
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }, [debouncedSearch, filters.sort_by, filters.sort_direction]);

    const handleCreate = () => {
        setEditingUser(null);
        reset();
        setShowFormModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: data.name,
            email: data.email,
            position: data.position,
            user_type: data.user_type,
            is_active: data.is_active ? 1 : 0,
        };

        if (editingUser) {
            put(`/users/${editingUser.id}/update`, {
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
            post(`/users/create`, {
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
    <AuthenticatedLayout user={auth.user}>
        <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex w-full justify-between">
                    <h1 className="text-2xl font-semibold text-black">Users</h1>
                    <div className="flex gap-2">
                        <div className="max-w-md">
                            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"> Search </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" value={search} onChange={(e)=> setSearch(e.target.value)} id="default-search" className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." />
                            </div>
                        </div>
                        <button onClick={() => handleCreate()} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center float-right">
                            Create User
                        </button>
                        <AnimatePresence>
                        {showFormModal && (
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
                                        {editingUser ? "Edit User" : "Create User"}
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
                                        <div>
                                            <label className="block text-sm font-medium">Email</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Position</label>
                                            <input
                                                type="text"
                                                value={data.position || ""}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                            {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">User Type</label>
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
                                            {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
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
                                            {editingUser ? "Update" : "Create"}
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
                            <th className="px-6 py-3">
                                <Link href={`/users`} data={{
                                ...filters,
                                sort_by: "name",
                                sort_direction: nextSortDirection("name"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Account Name {filters.sort_by === "name" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/users`} data={{
                                ...filters,
                                sort_by: "username",
                                sort_direction: nextSortDirection("username"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Email Address {filters.sort_by === "username" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/users`} data={{
                                ...filters,
                                sort_by: "position",
                                sort_direction: nextSortDirection("position"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Position {filters.sort_by === "position" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/users`} data={{
                                ...filters,
                                sort_by: "is_active",
                                sort_direction: nextSortDirection("is_active"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Status {filters.sort_by === "is_active" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                        </thead>
                        <tbody> {users?.data?.map((user) => ( <tr key={user.id} className="odd:bg-[#fafafa] even:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{user?.name}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{user.email ?? '-'}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200 capitalize">{user.position}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className={`absolute inline-flex h-full w-full rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'} opacity-75 animate-ping`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.is_active ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} `}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200">
                            </td>
                        </tr> ))} </tbody>
                    </table>
                    <div className="px-5 py-3">
                        {users && users.current_page && (
                            <PaginationWithSearch
                                current_page={users.current_page}
                                last_page={users.last_page}
                                links={users.links}
                                onPageChange={(url) => {
                                    if (!url) return;

                                    const params = new URL(url).searchParams.toString();

                                    fetch(`/api/users?${params}`)
                                        .then((res) => res.json())
                                        .then((data) => setUsers(data));
                                }}
                            />
                            )}

                    </div>
                </Card>
            </div>
        </main>
    </AuthenticatedLayout>
  );
}
