import { Container } from "@/components/core/Container";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Container className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Biz Haqida</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <p>
            Kidding - bolalar uchun sifatli va qulay kiyimlarni taqdim etuvchi
            onlayn do'kondir. Biz har bir bolaga eng yaxshi patyorni taqdim
            etish uchun ishlaydi.
          </p>

          <h2 className="text-2xl font-bold mt-8">Bizning Missiya</h2>
          <p>
            Biz bolalarning o'sish va rivojlanishiga yordam beradigan sifatli,
            komfortli va uslubli kiyimlarni taqdim etish uchun istaymiz.
          </p>

          <h2 className="text-2xl font-bold mt-8">Nega Kidding?</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>100% tabiiy materiallar</li>
            <li>Bepul yetkazish 150,000 so'mdan</li>
            <li>14 kunlik qaytarish siyosati</li>
            <li>Tez yetkazish va yuqori xidmat</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">Kontakt</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p>
              <strong>Manzil:</strong> Toshkent, Chilonzor, 12-kv, 34-uy
            </p>
            <p>
              <strong>Telefon:</strong> +998 90 123 45 67
            </p>
            <p>
              <strong>Email:</strong> info@kidding.uz
            </p>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
