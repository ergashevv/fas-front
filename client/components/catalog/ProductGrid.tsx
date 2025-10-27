import { Product } from "@shared/api";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid = ({ products, loading }: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-72 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="bg-gray-200 h-4 rounded w-3/4 animate-pulse" />
              <div className="bg-gray-200 h-3 rounded w-1/2 animate-pulse" />
              <div className="bg-gray-200 h-6 rounded w-1/3 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Mahsulotlar topilmadi</h3>
        <p className="text-gray-500">Boshqa filtrlarni sinab ko'ring</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};
