import { useEffect, useState } from "react";
import { Product } from "@shared/api";
import { ProductCard } from "@/components/catalog/ProductCard";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface ProductScrollerProps {
  title: string;
  filter?: (p: Product) => boolean;
}

export const ProductScroller = ({ title, filter }: ProductScrollerProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await api.products.getAll();
        let data = result.products;
        if (filter) data = data.filter(filter);
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filter]);

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};
