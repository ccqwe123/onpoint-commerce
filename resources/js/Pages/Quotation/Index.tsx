import Header from "@/Components/Header";
import PaginationWithSearch from "@/Components/PaginationWithSearch";
import { Paginated } from "@/types/Pagination";
import { Link } from "@inertiajs/react";
import { Order } from "@/types/Plan";
import { Card } from '@/Components/ui/card';
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Eye } from 'lucide-react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from '@inertiajs/react';

interface OrderProps {
  orders: Paginated<Order>;
  filters: {
    search?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
  };
}
type Props = PageProps & OrderProps;

export default function Home({ auth, orders: innitialOrders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [orders, setOrders] = useState<Paginated<Order>>(innitialOrders);

    const nextSortDirection = (column: string) => {
        if (filters.sort_by === column) {
        return filters.sort_direction === "asc" ? "desc" : "asc";
        }
        return "desc";
    };

    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetch(`/api/quotations?search=${debouncedSearch}&sort_by=${filters.sort_by || "id"}&sort_direction=${filters.sort_direction || "desc"}`)
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }, [debouncedSearch, filters.sort_by, filters.sort_direction]);

  return (
    <>
    <Head title="OnPoint | Quotation List" />
    <AuthenticatedLayout user={auth.user}>
        <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex w-full justify-between">
                    <h1 className="text-2xl font-semibold text-black">Quotation</h1>
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
                </div>
                <Card className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">
                                <Link href={`/quotation`} data={{
                                ...filters,
                                sort_by: "id",
                                sort_direction: nextSortDirection("id"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Quotation No. {filters.sort_by === "id" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/quotation`} data={{
                                ...filters,
                                sort_by: "client_name",
                                sort_direction: nextSortDirection("client_name"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Client Name {filters.sort_by === "client_name" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/quotation`} data={{
                                ...filters,
                                sort_by: "plan_name",
                                sort_direction: nextSortDirection("plan_name"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Monthly Plan {filters.sort_by === "plan_name" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/quotation`} data={{
                                ...filters,
                                sort_by: "total_quantity",
                                sort_direction: nextSortDirection("total_quantity"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Device Qty. {filters.sort_by === "total_quantity" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/quotation`} data={{
                                ...filters,
                                sort_by: "subtotal",
                                sort_direction: nextSortDirection("subtotal"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Device Subtotal {filters.sort_by === "subtotal" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3">
                                <Link href={`/quotation`} data={{
                                ...filters,
                                sort_by: "payment",
                                sort_direction: nextSortDirection("payment"),
                            }} preserveState replace>
                                <span className="inline-flex items-center"> Payment Termins {filters.sort_by === "payment" && (filters.sort_direction === "asc" ? (
                                    <ArrowUp className="ml-1 w-3 h-3" /> ) : (
                                    <ArrowDown className="ml-1 w-3 h-3" /> ))}
                                </span>
                                </Link>
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                        </thead>
                        <tbody> {orders?.data?.map((order) => ( <tr key={order.id} className="odd:bg-[#fafafa] even:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200"> {order.id} </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.client?.name}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.plan ? order.plan.name : '-'}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.items.reduce((total, item) => total + Number(item.quantity), 0)}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.subtotal}</td>
                            <td className="px-6 py-4 capitalize border-b border-gray-200">{order.payment == 'one-time' ? 'One Time' : order.payment == '6-months' ? '6 Months' : order.payment == '12-months' ? '12 Months' : order.payment == '24-months' ? '24 Months' : '-'}</td>
                            <td className="px-6 py-4 border-b border-gray-200">
                                <div className="hidden md:hidden lg:hidden xl:flex">
                                    <Link href={`/quotation/${order.id}/view`} className="text-black bg-white hover:bg-blue-800 hover:text-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2"> View Quotation </Link>
                                </div>
                                <div className="flex md:flex lg:flex xl:hidden">
                                    <Link href={`/quotation/${order.id}/view`} className="p-2 bg-white border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-100">
                                        <Eye className="w-5 h-5" />
                                    </Link> 
                                </div>
                            </td>
                        </tr> ))} </tbody>
                    </table>
                    <div className="px-5 py-3">
                        {orders && orders.current_page && (
                            <PaginationWithSearch
                                current_page={orders.current_page}
                                last_page={orders.last_page}
                                links={orders.links}
                                onPageChange={(url) => {
                                    if (!url) return;

                                    const params = new URL(url).searchParams.toString();

                                    fetch(`/api/quotations?${params}`)
                                        .then((res) => res.json())
                                        .then((data) => setOrders(data));
                                }}
                            />
                            )}

                    </div>
                </Card>
            </div>
        </main>
    </AuthenticatedLayout>
    </>
  );
}
