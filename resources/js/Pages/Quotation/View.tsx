import Header from "@/Components/Header";
import Pagination from "@/Components/Pagination";
import { Paginated } from "@/types/Pagination";
import { Link } from "@inertiajs/react";
import { Order, PlanData } from "@/types/Plan";
import { ChevronLeft, Check } from 'lucide-react';

interface OrderProps {
  order: Order
}

function getPaymentMonths(payment: string | null): number {
  switch (payment) {
    case "one-time":
      return 1;
    case "6-months":
      return 6;
    case "12-months":
      return 12;
    case "24-months":
      return 24;
    default:
      return 1; // fallback
  }
}

export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getMonthlyPayment(order: Order): string {
  const months = getPaymentMonths(order.payment);
  const planPrice = parseFloat(order.plan?.price ?? "0");
  const subtotal = parseFloat(order.subtotal ?? "0");

  const total = planPrice + subtotal;
  const monthly = total / months;

  return formatCurrency(monthly);
}

export default function Home({ order }: OrderProps) {
    console.log(order.plan?.descriptions);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
        <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold flex items-center gap-2">
                        <Link href="/quotation" className="flex items-center text-gray-500 hover:text-gray-700">
                            <ChevronLeft size={28} className="mr-1" />
                        </Link>
                        <span className="cursor-default select-none">Quotation No. {order?.id}</span>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="relative cursor-pointer rounded-xl p-6 transition-all duration-200 text-white bg-gradient-to-b from-[#0026AB] to-[#455BA8] hover:scale-105">
                        <h3 className="text-[30px] font-semibold">{order.plan ? order.plan.name : '-'}</h3>
                    </div>
                    <div className="py-4 px-2">
                        <div className="text-[30px] text-onpoint-btnblue font-bold mb-6">{order.plan && order.plan.price == null ? 'Custom' : '₱'+order.plan?.price+' /mo'}</div>
                        <div className="space-y-3 border-b border-black pb-5">
                            {order.items?.map((item, idx) => (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-0 py-1.5 px-2">
                                    <div className="text-base font-semibold">{item.product.category?.name}</div>
                                    <div className="text-center">x{item.quantity}</div>
                                    <div className="">{item.product.name}</div>
                                </div>
                            ))}
                        </div>
                        <div className="py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-0 py-1.5 px-2">
                                <div className="flex flex-col">
                                    <span className="text-[#797979] font-normal text-lg">Device Subtotal</span>
                                    <span className="text-black font-semibold text-3xl">₱{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#797979] font-normal text-lg">Payment Term</span>
                                    <span className="text-black font-semibold text-3xl">{order.payment == 'one-time' ? 'One Time' : order.payment == '6-months' ? '6 Months' : order.payment == '12-months' ? '12 Months' : order.payment == '24-months' ? '24 Months' : '-'}</span>
                                </div>
                                {/* <div className="flex flex-col">
                                    <span className="text-[#797979] font-normal text-lg">Total Monthly</span>
                                    <span className="text-black font-semibold text-3xl">₱{getMonthlyPayment(order)}</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
