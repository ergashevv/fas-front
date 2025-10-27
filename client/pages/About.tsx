import { Container } from "@/components/core/Container";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, MessageCircle, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-pattern-dots relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 bg-purple-200 rounded-full opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-8 h-8 bg-pink-200 rounded-full opacity-20"
          animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-16 h-16 bg-blue-100 rounded-full opacity-25"
          animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <Container className="py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            FAS Kids haqida
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bolalar uchun quvonchli, qulay va zamonaviy kiyimlar yaratamiz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Bizning Missiyamiz</h2>
              <p className="text-gray-600 leading-relaxed">
                FAS Kids - bolalar uchun sifatli va qulay kiyimlarni taqdim etuvchi do'kon. 
                Biz har bir bolaga eng yaxshi kiyimlarni taqdim etish va ota-onalarning ishonchini 
                qozonish uchun ishlaymiz. Sifatli materiallar, xavfsiz dizaynlar va hamyonbop narxlar 
                bizning asosiy tamoyillarimizdir.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Nega FAS Kids?</h2>
              <div className="space-y-3">
                {[
                  { icon: "✅", text: "100% sifatli va tabiiy materiallar" },
                  { icon: "🚚", text: "Tez yetkazish xizmati" },
                  { icon: "↩️", text: "14 kunlik qaytarish kafolati" },
                  { icon: "💰", text: "Hamyonbop narxlar" },
                  { icon: "🎨", text: "Zamonaviy va chiroyli dizaynlar" },
                  { icon: "👶", text: "Barcha yoshdagi bolalar uchun" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Location & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Location Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/images/info/location.jpg" 
                  alt="FAS Kids filliali"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold mb-1">"Minor Mall" filliali</h3>
                  <p className="text-white/90 text-sm">Bizning do'konimizga xush kelibsiz!</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Manzil:</p>
                    <p className="text-gray-600">Bolalar kasalxonasi ro'parasidagi "Minor mall" 2-qavat</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Ish vaqti:</p>
                    <p className="text-gray-600">09:30 - 23:00 (har kuni)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Telefon:</p>
                    <a href="tel:+998906376007" className="text-purple-600 hover:text-purple-700 font-medium">
                      +998 90 637 60 07
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-800 mb-3">Ijtimoiy tarmoqlar:</p>
                  <div className="flex gap-3">
                    <a 
                      href="https://t.me/faskids" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Telegram</span>
                    </a>
                    <a 
                      href="https://instagram.com/faskids_uz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600">
                <h3 className="text-white font-bold text-lg">Xaritada ko'rish</h3>
              </div>
              <div className="aspect-video">
                <iframe
                  src="https://yandex.uz/map-widget/v1/?ll=64.430694%2C39.780499&z=17&pt=64.430694,39.780499,pm2rdm"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bizga tashrif buyuring!</h2>
          <p className="text-lg mb-6 opacity-90">Do'konimizda siz uchun eng yaxshi kiyimlar kutmoqda</p>
          <Link 
            to="/products"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Mahsulotlarni ko'rish
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}
