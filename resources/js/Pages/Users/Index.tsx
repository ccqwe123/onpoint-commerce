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
import Status from "@/Components/Modals/Status";
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
    const [showModal, setShowModal] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [users, setUsers] = useState<Paginated<User>>(innitialOrders);
    const [editingUser, setEditingUser] = useState<User | null>(null);
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

    const togglePlan = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };
    const confirmToggle = () => {
       if (!editingUser) return;

        put(`/users/${editingUser.id}/toggle`, {
        data: { is_active: !editingUser.is_active },
        onSuccess: () => {
            setShowModal(false);
            setUsers((prev) => ({
                ...prev,
                data: prev.data.map((p) =>
                p.id === editingUser.id ? { ...p, is_active: !editingUser.is_active } : p
                ),
            }));
            (window as any).showToast("User Status updated successfully ✅", "success");
        },
        onError: () => {
            (window as any).showToast("Failed to update plan ❌", "error");
        },
        onFinish: () => {
            setShowModal(false);
        },
        });
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
                        <Link href="/users/create" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center float-right">
                            Create User
                        </Link>
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
                                sort_by: "email",
                                sort_direction: nextSortDirection("email"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Email Address {filters.sort_by === "email" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/users`} data={{
                                ...filters,
                                sort_by: "user_type",
                                sort_direction: nextSortDirection("user_type"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Type {filters.sort_by === "user_type" && (filters.sort_direction === "asc" ? (
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
                        <tbody> {users?.data?.map((user) => ( <tr key={user.id} className="even:bg-[#fafafa] odd:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{user?.name}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{user.email ?? '-'}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200 capitalize">{user.user_type}</td>
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
                                <Link href={`/users/${user.id}/edit`} className="text-black bg-white hover:bg-green-100 hover:text-black border border-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2"> Edit </Link>
                                {user.is_active ? ( 
                                    <button onClick={() => togglePlan(user)} className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2"> Set as Inactive </button> ) : ( 
                                    <button onClick={() => togglePlan(user)} className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2"> Set as Active </button> 
                                )}
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
                <Status
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmToggle}
                    isActive={editingUser?.is_active ?? false}
                    type="User"
                />
            </div>
        </main>
    </AuthenticatedLayout>
  );
}
