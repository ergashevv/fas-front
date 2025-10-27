import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/core/Container";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { api } from "@/lib/api";

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          api.products.getAll({ category: slug }),
          api.categories.getAll(),
        ]);

        const category = categoriesResult.find((c: any) => c.slug === slug);
        if (category) {
          setCategoryTitle(category.title);
        }
        setProducts(productsResult.products);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>
      <ProductGrid products={products} loading={loading} />
    </Container>
  );
}
