import { Link } from "react-router-dom";
import { Container } from "@/components/core/Container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-4xl font-bold">404 - Sahifa topilmadi</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Afsuski, siz izlayotgan sahifa mavjud emas. Bosh sahifaga qaytish
          uchun quyidagi tugmani bosing.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Bosh Sahifaga
          </Button>
        </Link>
      </motion.div>
    </Container>
  );
}
