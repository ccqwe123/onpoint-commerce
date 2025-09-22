import { Search, Check } from "lucide-react";
import { Button } from "@/Components/Button";
import { Link } from "@inertiajs/react";

const MainContent = () => {
  const features = [
    "Flexible plans tailored to meet your business needs",
    "Clear and transparent pricing with no hidden charges", 
    "Scalable solutions designed to support long-term growth"
  ];

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-blue-800" strokeWidth={2} />
          </div>
        </div>

        {/* Step indicator */}
        <p className="text-sm text-gray-500 font-medium tracking-wider uppercase !mt-0">
          STEP 1 OF 3
        </p>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight -tracking-[3%] !mt-2">
          Explore our affordable plans.
        </h1>

        {/* Feature list */}
        <div className="space-y-4 my-8">
          <div className="mx-auto w-[500px] flex flex-col gap-5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-left justify-left space-x-3 text-left">
                <Check className="w-5 h-5 text-onpoint-blue flex-shrink-0" strokeWidth={2} />
                <span className="text-gray-700 text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Link 
            href="/plan"
            className="inline-flex items-center justify-center bg-onpoint-dark-blue hover:bg-onpoint-dark-blue/90 text-white px-12 py-4 w-48 text-xl font-medium rounded-lg transition-colors"
            >
            Continue
        </Link>

      </div>
    </main>
  );
};

export default MainContent;