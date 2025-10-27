import { Product } from "@shared/api";
import { ProductCard } from "@/components/catalog/ProductCard";
import { motion } from "framer-motion";
import { Container } from "@/components/core/Container";
import { Heart, Sparkles } from "lucide-react";

interface RecommendedProductsProps {
  products: Product[];
  loading?: boolean;
}

export const RecommendedProducts = ({ products, loading }: RecommendedProductsProps) => {
  if (loading) {
    return (
      <Container className="py-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-72" />
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                  <div className="bg-gray-200 h-6 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Container className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tavsiya qilingan mahsulotlar
            </h2>
            <p className="text-gray-600">
              Sizga mos keladigan boshqa mahsulotlar
            </p>
          </div>
        </div>

        {/* Products Grid */}
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
      </motion.div>
    </Container>
  );
};
