import { Container } from "@/components/core/Container";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategorySlider } from "@/components/home/CategorySlider";
import { AgeChips } from "@/components/home/AgeChips";
import { ProductScroller } from "@/components/home/ProductScroller";
import { useTranslation } from "@/lib/useTranslation";
import { motion } from "framer-motion";

export default function Index() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-home bg-pattern-hearts relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 bg-slate-200 rounded-full opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-8 h-8 bg-slate-300 rounded-full opacity-20"
          animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-16 h-16 bg-slate-100 rounded-full opacity-25"
          animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-6 h-6 bg-slate-200 rounded-full opacity-30"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 left-1/2 w-10 h-10 bg-slate-300 rounded-full opacity-20"
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
      </div>

      <Container className="pt-8 pb-16 relative z-10">
        <HeroBanner />

        <div className="mt-16">
          <CategorySlider />
        </div>

        <div className="mt-16">
          <AgeChips />
        </div>

        <div className="mt-16">
          <ProductScroller
            title={t("newArrivals")}
            filter={(p) => p.available}
          />
        </div>

        <div className="mt-16">
          <ProductScroller
            title={t("mostPopular")}
            filter={(p) => (p.rating || 0) >= 4.5}
          />
        </div>

        <div className="mt-16 py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">{t("trustBadge")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-bold">{t("cotton")}</h3>
                <p className="text-sm text-muted-foreground">{t("natural")}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-bold">{t("fastDelivery")}</h3>
                <p className="text-sm text-muted-foreground">{t("days")}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">↩️</div>
                <h3 className="font-bold">{t("returnPolicy")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("easyReturn")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
