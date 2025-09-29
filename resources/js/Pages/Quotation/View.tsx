import { Link } from "@inertiajs/react";
import { Order, PlanData } from "@/types/Plan";
import { Printer, ChevronLeft, Loader2 } from 'lucide-react';
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Print from "@/Pages/Quotation/Print";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

interface OrderProps {
  order: Order
}
type ViewProps = PageProps & OrderProps;

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

export default function Home({ auth, order }: ViewProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    
    const handlePrint = useReactToPrint({
      contentRef: printRef, 
      documentTitle: "Quotation",
      onPrintError: () => setIsPrinting(false),
    });
     const startPrint = async () => {
      setIsPrinting(true);
      try {
        await handlePrint();
      } finally {
        setTimeout(() => setIsPrinting(false), 1500);
      }
    };
  return (
    <AuthenticatedLayout user={auth.user}>
        <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold flex items-center gap-2">
                        <Link href="/quotation" className="flex items-center text-gray-500 hover:text-gray-700">
                            <ChevronLeft size={28} className="mr-1" />
                        </Link>
                        <span className="cursor-default select-none">Quotation No. {order?.id}</span>
                    </div>
                    <button
                      onClick={startPrint}
                      disabled={isPrinting}
                      className="bg-onpoint-btnblue px-4 py-2 flex justify-center items-center gap-2 text-white rounded-lg hover:bg-blue-900 disabled:opacity-60"
                    >
                      {isPrinting ? (
                        <Loader2 className="w-4 h-4 shrink-0 animate-spin text-white" />
                      ) : (
                        <Printer className="w-4 h-4 shrink-0 text-white" />
                      )}
                      {isPrinting ? "Printing..." : "Print"}
                    </button>
                    <div className="hidden">
                      <Print ref={printRef} order={order} />
                    </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="w-[40%]">
                      <div className="relative cursor-pointer rounded-xl py-3 px-4 transition-all duration-200 text-white bg-gradient-to-b from-[#0026AB] to-[#000518] hover:scale-105">
                          <h3 className="text-[24px] font-medium">{order.plan ? order.plan.name : '-'}</h3>
                          <div className="text-[40px] text-white font-semibold">
                            {order.plan && order.plan.price == null ? 'Custom' : '₱'+order.plan?.price+' /mo'}
                          </div>
                      </div>
                      <div className="py-4 px-2">
                          <div className="space-y-3 border-b border-black pb-5">
                              {order.items?.map((item, idx) => (
                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-0 py-1.5 px-2">
                                      <div className="text-base font-semibold">{item.product.category?.name}</div>
                                      <div className="text-center">x{item.quantity}</div>
                                      <div className="">{item.product.name}</div>
                                  </div>
                              ))}
                          </div>
                          <div className="py-5">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-0 py-1.5 px-2">
                                  <div className="flex flex-col">
                                      <span className="text-[#797979] font-normal text-base">Device Subtotal</span>
                                      <span className="text-black font-semibold text-3xl">₱{formatCurrency(order.subtotal)}</span>
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-[#797979] font-normal text-base">Payment Term</span>
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
            </div>
        </main>
    </AuthenticatedLayout>
  );
}
