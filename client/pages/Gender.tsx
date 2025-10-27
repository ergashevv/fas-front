import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "@shared/api";
import { Container } from "@/components/core/Container";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { api } from "@/lib/api";

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
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">{genderTitle}</h1>
      <ProductGrid products={products} loading={loading} />
    </Container>
  );
}
