import { Container } from "@/components/core/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/useTranslation";
import { motion } from "framer-motion";

export default function Profile() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-profile bg-pattern-circles relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 bg-green-100 rounded-full opacity-40"
          animate={{ y: [0, -18, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 right-20 w-10 h-10 bg-green-200 rounded-full opacity-30"
          animate={{ y: [0, 22, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-14 h-14 bg-green-100 rounded-full opacity-35"
          animate={{ y: [0, -15, 0], x: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-8 h-8 bg-green-200 rounded-full opacity-40"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Container className="py-12">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-black"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t("personalCabinet")}
        </motion.h1>

      <Tabs defaultValue="dashboard" className="max-w-4xl">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-300">
          <TabsTrigger value="dashboard" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">{t("main")}</TabsTrigger>
          <TabsTrigger value="orders" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">{t("orders")}</TabsTrigger>
          <TabsTrigger value="addresses" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">{t("addresses")}</TabsTrigger>
          <TabsTrigger value="wishlist" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">{t("wishlist")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 text-black">{t("personalInfo")}</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">{t("name")}</p>
                  <p className="font-semibold text-black">Javohir Karimov</p>
                </div>
                <div>
                  <p className="text-gray-600">{t("email")}</p>
                  <p className="font-semibold text-black">javohir@example.com</p>
                </div>
                <div>
                  <p className="text-gray-600">{t("phone")}</p>
                  <p className="font-semibold text-black">+998 90 123 45 67</p>
                </div>
              </div>
            </div>

            <div className="bg-black text-white border border-gray-300 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-2">
                📊 {t("moySkladIntegration")}
              </h2>
              <p className="text-gray-300 text-sm">
                {t("comingSoon")}
              </p>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-gray-600">{t("noOrders")}</p>
          </motion.div>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-black">Toshkent</h3>
                  <p className="text-sm text-gray-600">
                    Chilonzor 12-kv, 34-uy
                  </p>
                  <p className="text-sm text-gray-600">
                    +998 90 123 45 67
                  </p>
                </div>
                <span className="text-xs bg-black text-white px-2 py-1 rounded">
                  {t("primary")}
                </span>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-gray-600">
              {t("noWishlist")}
            </p>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Container>
    </motion.div>
    </div>
  );
}
