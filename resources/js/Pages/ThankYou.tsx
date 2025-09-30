import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types"; 

export default function Home({ auth }: PageProps) {
  return (
      <AuthenticatedLayout user={auth.user}>
      <motion.div className="flex-1 flex items-center justify-center px-4 py-12 !min-h-[90vh]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}>
          <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="flex justify-center">
                  <div className="w-40 h-20 bg-transparent rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 flex-shrink-0 text-onpoint-dark-blue" strokeWidth={2} />
                  </div>
              </div>


              {/* Main heading */}
              <p className="text-sm font-medium tracking-wider uppercase !mt-0">
                CONGRATULATIONS
              </p>
              
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight -tracking-[3%] !mt-2 py-5 mb-2">
                  Welcome to OnPoint!
              </h1>
              <p className="text-base font-normal tracking-wider !mt-0">
                Welcome aboard! With your quotation finalized, you’re one step closer to smarter solutions and smoother operations with OnPoint.
              </p>


              <Link 
                  href="/"
                  className="inline-flex items-center justify-center bg-onpoint-dark-blue hover:bg-onpoint-dark-blue/90 text-white px-12 py-4 w-48 text-xl font-medium rounded-lg transition-colors"
                  >
                  Continue
              </Link>

          </div>
        </motion.div>
      </AuthenticatedLayout>
  );
}
