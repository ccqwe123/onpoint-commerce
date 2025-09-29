import { useEffect, useState } from "react";
import { Plus, Check, ShoppingBag, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/Button";
import axios from "axios";
import Header from "@/Components/Header";
import ProductQuickView from "@/Components/ProductQuickView";
import { Product, ProductView } from "@/types/Product";
import CartSlideover from "@/Components/CartSlideover";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

interface Category {
  id: number;
  name: string;
  products: Product[];
}
type ProductCategoryProps = PageProps & Category;

const Products = ({auth}: ProductCategoryProps) => {
  const [loading, setLoading] = useState(true);
  const [openCart, setOpenCart] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    axios.get("/api/categories-products").then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setSelectedCategory(res.data[0].name);
      }
    }).finally(() => setLoading(false));
  }, []);

  const addToCart = (productId: number) => {
    // if (added) return;
    setAdded(true);
    setAddedProducts((prev) => new Set([...prev, productId]));
    const next = { ...cart, [productId]: (cart[productId] || 0) + 1 };
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    setTimeout(() => {
    setAddedProducts((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        setAdded(false);
        return next;
      });
    }, 1500);
  };

  const handleAddToCart = (productId: number, quantity: number = 1) => {
    setAdded(true);
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity,
    }));
    setTimeout(() => setAdded(false), 1500);
  };

  const cartItemCount = Object.values(cart).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleImageError = (e: any) => {
    e.target.src =
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de";
    e.target.alt = "Product placeholder image";
  };

  // Find products for selected category
  const currentCategory = categories.find(
    (c) => c.name === selectedCategory
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <motion.div
  className="flex-1 p-16 pb-28"
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.98 }}
>
  <div className="max-w-[1480px] mx-auto">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
          STEP 2 OF 3
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 lg:mb-0">
          Choose your devices
        </h1>
      </div>
      <div className="relative">
        <ShoppingBag
          className="w-8 h-8 text-gray-600"
          onClick={() => setOpenCart(true)}
        />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-onpoint-btnblue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
            {cartItemCount}
          </span>
        )}
      </div>
      <CartSlideover
        open={openCart}
        setOpen={setOpenCart}
        cart={cart}
        setCart={setCart}
      />
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Categories Sidebar */}
      <div className="lg:col-span-1 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-16 bg-gray-200 rounded-lg animate-pulse"
                />
              ))
            : categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-5 py-5 rounded-lg border transition-all duration-200 ${
                    selectedCategory === category.name
                      ? "bg-onpoint-btnblue text-white border-onpoint-btnblue"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="w-full h-64 bg-gray-200 animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : currentCategory?.products.map((product) => {
                const isAdded = addedProducts.has(product.id);
                return (
                  <div
                    key={product.id}
                    className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div
                      className="w-full h-64 bg-gray-300 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setQuickViewOpen(true);
                      }}
                    >
                      <img
                        src={
                          product.images.find((img) => img.is_primary)
                            ?.image_path || product.images[0]?.image_path
                        }
                        alt={product.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-900 font-semibold">
                            ₱{product.discount_price || product.price}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          disabled={isAdded}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                            ${isAdded ? "bg-green-600" : "bg-onpoint-blue hover:bg-onpoint-dark-blue"} text-white`}
                        >
                          <motion.div
                            key={isAdded ? "check" : "plus"}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </motion.div>
                        </button>
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          className="w-8 h-8 bg-onpoint-blue text-white rounded-full flex items-center justify-center hover:bg-onpoint-dark-blue transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  </div>

  {/* Quick View Modal */}
  {selectedProduct && (
    <ProductQuickView
      product={selectedProduct}
      isOpen={isQuickViewOpen}
      onClose={() => setQuickViewOpen(false)}
      onAddToCart={handleAddToCart}
    />
  )}
</motion.div>

{/* Footer */}
<footer className="w-full fixed bottom-0 bg-white shadow-[0_-1px_1px_rgba(0,0,0,0.1)] py-6">
  <div className="max-w-[1480px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
    <Link
      href="/plan"
      className="px-12 py-3 text-base font-medium rounded-lg transition-all bg-transparent hover:bg-blue-950 hover:text-white text-onpoint-btnblue border border-onpoint-btnblue"
    >
      Back
    </Link>
    {cartItemCount > 0 ? (
      <Link
        href="/shopping-cart"
        className="px-12 py-3 text-base font-medium rounded-lg transition-all bg-onpoint-btnblue hover:bg-onpoint-dark-blue/90 text-white"
      >
        Continue
      </Link>
    ) : (
      <span className="px-12 py-3 select-none text-base font-medium rounded-lg transition-all bg-gray-300 text-gray-500 cursor-not-allowed">
        Continue
      </span>
    )}
  </div>
</footer>

    </AuthenticatedLayout>
  );
};

export default Products;
