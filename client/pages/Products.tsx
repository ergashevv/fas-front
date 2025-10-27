import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@shared/api";
import { Container } from "@/components/core/Container";
import { Filters } from "@/components/catalog/Filters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { useFilters } from "@/store/useFilters";
import { useTranslation } from "@/lib/useTranslation";
import { api } from "@/lib/api";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = useFilters();
  const { t } = useTranslation();

  useEffect(() => {
    const loadAndFilter = async () => {
      setLoading(true);
      
      try {
        // Build query parameters
        const params: Record<string, any> = {};
        
        // URL filters
        if (searchParams.has("search")) {
          params.search = searchParams.get("search");
        }
        if (searchParams.has("age")) {
          params.age = searchParams.get("age");
        }
        if (searchParams.has("gender")) {
          params.gender = searchParams.get("gender");
        }
        if (searchParams.has("category")) {
          params.category = searchParams.get("category");
        }

        // Store filters
        if (filters.gender.length > 0) {
          params.gender = filters.gender[0];
        }
        if (filters.ageRange.length > 0) {
          params.age = filters.ageRange[0];
        }
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];

        // Fetch from API
        const result = await api.products.getAll(params);
        let data = result.products;

        // Apply local filters (colors, additional constraints)
        if (filters.colors.length > 0) {
          data = data.filter((p: Product) =>
            filters.colors.some((c) => p.colors.includes(c)),
          );
        }

        // Apply sort
        if (filters.sort === "rating") {
          data = data.sort(
            (a: Product, b: Product) => (b.rating || 0) - (a.rating || 0),
          );
        } else if (filters.sort === "price-asc") {
          data = data.sort((a: Product, b: Product) => a.price - b.price);
        } else if (filters.sort === "price-desc") {
          data = data.sort((a: Product, b: Product) => b.price - a.price);
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Show error state instead of mock data
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAndFilter();
  }, [searchParams, filters]);

  return (
    <div className="min-h-screen bg-products bg-pattern-stars relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-10 h-10 bg-purple-100 rounded-full opacity-40"
          animate={{ y: [0, -15, 0], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 right-20 w-12 h-12 bg-purple-200 rounded-full opacity-30"
          animate={{ y: [0, 18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-8 h-8 bg-purple-100 rounded-full opacity-35"
          animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-10 h-10 bg-purple-200 rounded-full opacity-40"
          animate={{ y: [0, 25, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <Container className="py-8 relative z-10">
      <h1 className="text-3xl font-bold mb-8">
        {searchParams.has("search") 
          ? `"${searchParams.get("search")}" ${t("searchResults")}`
          : t("products")
        }
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <Filters />
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <SlidersHorizontal size={20} />
                {t("filter")}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="mt-8">
                <Filters />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 text-sm text-muted-foreground">
            {products.length} {t("productsFound")}
          </div>
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </Container>
    </div>
  );
}
