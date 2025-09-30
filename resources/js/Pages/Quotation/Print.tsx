// Print.tsx
import React from "react";
import { Order } from "@/types/Plan";

export type PrintProps = {
  order: Order;
};



export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getPaymentMonths(payment: string | null | undefined): number {
  switch (payment) {
    case "one-time": return 1;
    case "6-months": return 6;
    case "12-months": return 12;
    case "24-months": return 24;
    default: return 1;
  }
}

function getMonthlyPayment(payment: string | null | undefined, plan: number | string | null | undefined, subt: number | string | null | undefined): number {
  const months = getPaymentMonths(payment);
  const planPrice = typeof plan === "string" ? parseFloat(plan) || 0 : (plan ?? 0);
  const subtotal = typeof subt === "string" ? parseFloat(subt) || 0 : (subt ?? 0);
  const total = planPrice + subtotal;
  return total / months;
}

const Print = React.forwardRef<HTMLDivElement, PrintProps>(({ order }, ref) => {
  const subtotal = typeof order.subtotal === "string" ? parseFloat(order.subtotal) || 0 : (order.subtotal ?? 0);
  const monthly = getMonthlyPayment(order.payment ?? null, order.plan?.price ?? 0, subtotal);
  const total = subtotal + monthly;
  
  function numberToWords(num: number): string {
    if (num === 0) return "zero";

    const belowTwenty = [
      "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
      "seventeen", "eighteen", "nineteen"
    ];
    const tens = [
      "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];
    const thousands = ["", "thousand", "million", "billion"];

    function helper(n: number): string {
      if (n === 0) return "";
      if (n < 20) return belowTwenty[n] + " ";
      if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
      if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
      for (let i = 0; i < thousands.length; i++) {
        const unit = Math.pow(1000, i + 1);
        if (n < unit) {
          return helper(Math.floor(n / Math.pow(1000, i))) + thousands[i] + " " + helper(n % Math.pow(1000, i));
        }
      }
      return "";
    }

    return helper(num).trim();
  }

  function convertAmountToWords(amount: number): string {
    const pesos = Math.floor(amount);
    const centavos = Math.round((amount - pesos) * 100);

    let words = numberToWords(pesos) + " pesos";
    if (centavos > 0) {
      words += " and " + numberToWords(centavos) + " centavos";
    }
    return words;
  }
  return (
    <div ref={ref} className="p-10 font-sans text-gray-900 text-sm w-[800px] mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-onpoint-btnblue">Quotation</h1>
          <div className="flex flex-col gap-1.5">
            <p className="mt-2 text-[#BCBCBC]">Quotation # <span className="font-bold text-sm pl-7 text-black">&#09;&#09;{String(order.id).padStart(4, "0")}</span></p>
            <p className="text-[#BCBCBC]">Quotation Date: <span className="font-bold text-sm text-black">&nbsp;
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).replace(/^([A-Za-z]+)/, "$1.")}</span></p>
          </div>
        </div>
        <div>
          <img src="/images/OnPoint-Logo-Print.png" alt="Logo" className="h-[72px] object-contain" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-onpoint-btnblue font-semibold text-sm">Quotation by</h3>
          <p className="font-bold mt-1 text-sm capitalize">{order.user?.name}</p>
          <p className="text-[#BCBCBC] text-sm capitalize">{order.user?.position}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md text-sm">
          <h3 className="text-onpoint-btnblue font-semibold">Quotation to</h3>
          <p className="font-bold mt-1 text-sm capitalize">{order.client?.name}</p>
          <p className="text-gray-800 text-sm">Client</p>
        </div>
      </div>

      {/* Plan / Price */}
      <div className="mt-6 flex">
          <h2 className="text-xl font-bold capitalize border-r border-black pr-2">{order.plan?.name} </h2>
          { order.payment == 'one-time'}
          <p className="text-2xl font-bold text-gray-900 pl-2">{order.plan?.price != null ? '₱'+order.plan?.price : 'Custom'}</p>
          <span className="text-gray-800 font-normal flex justify-center items-center pl-1">{order.plan?.price != null ? ' /month' : ''}</span>
      </div>

      {/* Items Table */}
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-onpoint-btnblue rounded rounded-tl-xl text-white text-left">
            <th className="px-3 py-2 text-xs w-[5%]">No.</th>
            <th className="px-3 py-2 text-xs w-[50%]">Item(s)</th>
            <th className="px-3 py-2 text-xs w-[5%] text-center">Qty</th>
            <th className="px-3 py-2 text-xs w-[20%] text-right">Unit Price</th>
            <th className="px-3 py-2 text-xs w-[20%] text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, i) => (
            <tr key={i} className="">
              <td className={`px-3 pb-[2px] text-xs text-center ${i == 0 ? 'pt-2' : ''}`}>{i+1}</td>
              <td className={`px-3 pb-[2px] text-xs`}>{item.product?.name}</td>
              <td className="px-3 pb-[2px] text-xs text-center">{item.quantity}</td>
              <td className="px-3 pb-[2px] text-xs text-right">₱{item.price.toLocaleString()}</td>
              <td className="px-3 pb-[2px] text-xs text-right">₱{(item.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Notes + Totals Section */}
      <div className="grid grid-cols-1 gap-12 mt-6 text-xs">
        <div className="w-full max-w-sm ml-auto">
          <div className="flex justify-between py-1 text-xs">
            <span>Subtotal</span>
            <span>₱{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-1 text-xs">
            <span>Payment Terms</span>
            <span>
              {order.payment === "one-time"
                ? "One Time"
                : order.payment === "6-months"
                ? "6 Months"
                : order.payment === "12-months"
                ? "12 Months"
                : order.payment === "24-months"
                ? "24 Months"
                : ""}
            </span>
          </div>
          <div className="flex justify-between py-0 text-xs">
            <span className="text-[#BCBCBC] py-1">
              Due for{" "}
              {order.payment === "one-time"
                ? "One Time"
                : order.payment === "6-months"
                ? "6 Months"
                : order.payment === "12-months"
                ? "12 Months"
                : order.payment === "24-months"
                ? "24 Months"
                : ""}
            </span>
            <span className="text-[#BCBCBC]">
              ({monthly.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })})
            </span>
          </div>
          <div className="flex justify-between py-2 border-t text-xl">
            <span className="text-black font-semibold">Total</span>
            <span className="text-onpoint-btnblue font-semibold">
              ₱
              {total.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex flex-col py-2 border-b">
            <span className="text-[#BCBCBC] text-[10px]">Quotation Total in words</span>
            <span className="text-[#BCBCBC]">
              {convertAmountToWords(total)} only
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4 w-1/2">
        <div>
          <h3 className="font-semibold text-onpoint-btnblue text-xs">Terms and Conditions</h3>
          <ol className="list-decimal ml-5 text-gray-800 text-[10px]">
            <li>This quotation is valid for 30 days from the date of issuance, unless otherwise stated.</li>
            <li>Prices and availability of devices may change without prior notice if the quotation has expired.</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold text-onpoint-btnblue text-xs">Validity of Quotation</h3>
          <ol className="list-decimal ml-5 text-gray-800 text-[10px]">
            <li>All prices are quoted in Pesos, exclusive of taxes, duties, shipping, and installation fees unless otherwise specified.</li>
            <li>Discounts, if applicable, are reflected in the quotation.</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold text-onpoint-btnblue text-xs">Additional Notes</h3>
          <ol className="list-decimal ml-5 text-gray-800 text-[10px]">
            <li>Lead times may vary depending on stock availability at the time of order.</li>
            <li>Prices are subject to change without prior notice if the quotation has expired.</li>
            <li>Any customization, add-ons, or special requests not stated in this quotation will be subject to a separate cost.</li>
          </ol>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 mt-12 flex justify-end text-center">
        <div>
          <span className="text-xs">{order.user?.position}</span>
          <p className="text-xs text-gray-600">Authorized Signature</p>
        </div>
      </div>

      <div className="absolute bottom-10 mt-10 text-xs text-gray-600">
        <p>
          For inquiries, email us at <span className="font-semibold">sample@email.com</span> <br/>or
          call us on <span className="font-semibold">(+632) 1234 5678</span>
        </p>
      </div>
    </div>
  );
});

Print.displayName = "Print";
export default Print;