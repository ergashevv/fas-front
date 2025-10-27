import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "@shared/api";
import { Container } from "@/components/core/Container";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { api } from "@/lib/api";
import { Home, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Gender() {
  const { gender } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await api.products.getAll({ gender });
        setProducts(result.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [gender]);

  const genderTitle =
    gender === "boy"
      ? "O'g'il bolalar kiyimlari"
      : gender === "girl"
        ? "Qiz bolalar kiyimlari"
        : "Hammasiga";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-pattern-dots">
      <Container className="py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-6 overflow-x-auto pb-2"
        >
          <Link 
            to="/" 
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            <span>Bosh sahifa</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Link 
            to="/products" 
            className="text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
          >
            Mahsulotlar
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 font-medium whitespace-nowrap">
            {genderTitle}
          </span>
        </motion.nav>

        <h1 className="text-3xl font-bold mb-8">{genderTitle}</h1>
        <ProductGrid products={products} loading={loading} />
      </Container>
    </div>
  );
}
