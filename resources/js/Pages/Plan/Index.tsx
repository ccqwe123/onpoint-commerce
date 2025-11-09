import Header from "@/Components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PlanData } from "@/types/Plan";
import Pagination from "@/Components/Pagination";
import { Paginated } from "@/types/Pagination";
import { Link } from "@inertiajs/react";
import Status from "@/Components/Modals/Status";
import { useForm } from "@inertiajs/react";
import { Card } from '@/Components/ui/card';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from '@inertiajs/react';
import { PencilLine, ToggleLeft, ToggleRight  } from "lucide-react"; 

interface PlansPageProps {
  plans: Paginated<PlanData>;
}
type Props = PageProps & PlansPageProps;
export default function PlanPage({ plans, auth }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
    const { put, processing } = useForm();

    const togglePlan = (plan: PlanData) => {
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const confirmToggle = () => {
        if (!selectedPlan) return;

        put(`/plan/${selectedPlan.id}/toggle`, {
        data: { is_active: !selectedPlan.is_active },
        onSuccess: () => {
            setShowModal(false);
            (window as any).showToast("Plan updated successfully ✅", "success");
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
        <>
        <Head title="OnPoint | Plan List" />
        <AuthenticatedLayout user={auth.user}>
         <main className="px-4 py-12">
            <div className="max-w-[1480px] mx-auto space-y-8">
                <h1 className="text-2xl font-semibold text-gray-900">Plans</h1>
                <Card className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Plan name</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody> {plans.data.map((plan) => ( <tr key={plan.id} className="odd:bg-[#fafafa] even:bg-white">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"> {plan.name} </td>
                            <td className="px-6 py-4"> {plan.discount_price ? `${plan.discount_price} (discounted from ${plan.price})` : plan.price ?? "-"} </td>
                            <td className="px-6 py-4 capitalize">{plan.type}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className={`absolute inline-flex h-full w-full rounded-full ${plan.is_active ? 'bg-green-400' : 'bg-red-400'} opacity-75 animate-ping`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${plan.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.is_active ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} `}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link href={`/plan/${plan.id}`} className="text-black bg-white hover:bg-blue-800 hover:text-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2"> Edit </Link> {plan.is_active ? ( <button onClick={()=> togglePlan(plan)} className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2" > Set as Inactive </button> ) : ( <button onClick={()=> togglePlan(plan)} className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2" > Set as Active </button> )}
                                </div>
                                <div className="flex sm:hidden items-center gap-2">
                                    <Link href={`/plan/${plan.id}`} className="p-2 bg-white border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-100">
                                    <PencilLine className="w-5 h-5" />
                                    </Link> {plan.is_active ? ( <button onClick={()=> togglePlan(plan)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" >
                                        <ToggleLeft className="w-5 h-5" />
                                    </button> ) : ( <button onClick={()=> togglePlan(plan)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700" >
                                        <ToggleRight className="w-5 h-5" />
                                    </button> )}
                                </div>
                            </td>
                        </tr> ))} </tbody>
                    </table>
                    <div className="px-5 py-3">
                        <Pagination
                            current_page={plans.current_page}
                            last_page={plans.last_page}
                            links={plans.links}
                        />
                    </div>
                </Card>
                 <Status
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmToggle}
                    isActive={selectedPlan?.is_active ?? false}
                    type="Plan"
                />
            </div>
        </main>
        </AuthenticatedLayout>
    </>
  );
}
