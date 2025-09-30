import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import Header from "@/Components/Header";
import { Link } from "@inertiajs/react";
import { PlanData } from "@/types/Plan";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

type PlanProps = PageProps;
const Plans = ({auth}: PlanProps) => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    axios.get("/api/plans").then((res) => {
      setPlans(res.data);
    });
  }, []);

  useEffect(() => {
    const savedPlan = localStorage.getItem("selectedPlan");
    if (savedPlan) {
      setSelectedPlan(Number(savedPlan));
    }
  }, []);

  return (
    <AuthenticatedLayout user={auth.user}>
      <motion.div className="flex-1 p-16"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}>
        <div className="max-w-[1480px] mx-auto">
          {/* Step indicator */}
          <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
            STEP 1 OF 3
          </p>

          {/* Header with tabs */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 lg:mb-0">
              Choose the plan that's right for you.
            </h1>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 px-10">
            {plans.map((plan, index) => {
              let gradientClass = "";
              if (index === 0) {
                gradientClass = "bg-gradient-to-b from-[#0026AB] to-[#455BA8]";
              } else if (index === 1) {
                gradientClass = "bg-gradient-to-b from-[#0026AB] to-[#001766]";
              } else {
                gradientClass = "bg-gradient-to-b from-[#0026AB] to-[#000518]";
              }

              return(
              <div key={plan.id}>
                {/* Plan Card */}
                <div
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    localStorage.setItem("selectedPlan", plan.id.toString());
                  }}
                  className={`relative cursor-pointer rounded-xl p-6 transition-all duration-200 text-white ${gradientClass} ${
                    selectedPlan === plan.id ? "shadow-lg scale-105" : "hover:scale-105"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <div className="absolute top-8 right-4">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-onpoint-blue" />
                      </div>
                    </div>
                  )}

                  {/* Plan name */}
                  <h3 className="text-[30px] font-semibold">{plan.name}</h3>
                </div>

                {/* Price + Descriptions */}
                <div className="py-4 px-2">
                  <div className="text-[30px] text-onpoint-btnblue font-bold mb-6">
                    {plan.price
                      ? `₱${parseFloat(plan.price).toLocaleString()} /mo`
                      : plan.discount_price
                      ? `₱${parseFloat(plan.discount_price).toLocaleString()}`
                      : "Custom"}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.descriptions.map((desc, idx) => (
                      <div key={desc.id ?? idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{desc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          )}
          </div>

          <div className="flex justify-start">
            
          </div>
        </div>
      </motion.div>
      <footer className="w-full fixed bottom-0 bg-white shadow-[0_-1px_1px_rgba(0,0,0,0.1)] py-6">
        <div className="max-w-[1480px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <Link 
              href="/"
              disabled={!selectedPlan}
              className={`px-12 py-3 text-base font-medium rounded-lg transition-all ${
                "bg-transparent hover:bg-blue-950 hover:text-white text-onpoint-btnblue font-semibold border border-onpoint-btnblue" 
              }`}
            >
              Back
            </Link>
            {selectedPlan ? (
              <Link
                href="/devices"
                className="px-12 py-3 text-base font-medium rounded-lg transition-all bg-onpoint-btnblue hover:bg-onpoint-dark-blue/90 text-white"
              >
                Continue
              </Link>
            ) : (
              <span
                className="px-12 py-3 select-none text-base font-medium rounded-lg transition-all bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Continue
              </span>
            )}
        </div>
    </footer>
    </AuthenticatedLayout>
  );
};

export default Plans;