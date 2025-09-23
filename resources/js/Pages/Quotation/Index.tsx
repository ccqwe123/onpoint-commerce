import Header from "@/Components/Header";
import Pagination from "@/Components/Pagination";
import { Paginated } from "@/types/Pagination";
import { Link } from "@inertiajs/react";
import { Order } from "@/types/Plan";
import { Card } from '@/Components/ui/card';

interface OrderProps {
  orders: Paginated<Order>;
}


export default function Home({ orders }: OrderProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
        <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <h1 className="text-2xl font-semibold text-black">Quotation</h1>
                <Card className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Quotation No.</th>
                            <th className="px-6 py-3">Client Name</th>
                            <th className="px-6 py-3">Monthly Plan</th>
                            <th className="px-6 py-3">Device Qty.</th>
                            <th className="px-6 py-3">Device Subtotal</th>
                            <th className="px-6 py-3">Payment Termins</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                        </thead>
                        <tbody> {orders.data.map((order) => ( <tr key={order.id} className="odd:bg-[#fafafa] even:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200"> {order.id} </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200"> </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.plan ? order.plan.name : '-'}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.items.reduce((total, item) => total + Number(item.quantity), 0)}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">{order.subtotal}</td>
                            <td className="px-6 py-4 capitalize border-b border-gray-200">{order.payment == 'one-time' ? 'One Time' : order.payment == '6-months' ? '6 Months' : order.payment == '12-months' ? '12 Months' : order.payment == '24-months' ? '24 Months' : '-'}</td>
                            <td className="px-6 py-4 border-b border-gray-200">
                                <Link href={`/quotation/${order.id}/view`} className="text-black bg-white hover:bg-blue-800 hover:text-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2"> View Quotation </Link>
                            </td>
                        </tr> ))} </tbody>
                    </table>
                    <div className="px-5 py-3">
                        <Pagination
                            current_page={orders.current_page}
                            last_page={orders.last_page}
                            links={orders.links}
                        />
                    </div>
                </Card>
            </div>
        </main>
    </div>
  );
}
