import { Container } from "@/components/core/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Xabaringiz yuborildi! Tez orada javob beramiz.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Container className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Biz Bilan Aloqa</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-bold text-lg mb-2">📍 Manzil</h3>
              <p className="text-muted-foreground">
                Toshkent, Chilonzor
                <br />
                12-kv, 34-uy
                <br />
                Uzbekistan 100000
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">📞 Telefon</h3>
              <p className="text-muted-foreground">+998 90 123 45 67</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">📧 Email</h3>
              <p className="text-muted-foreground">info@kidding.uz</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">🕒 Ish Vaqti</h3>
              <p className="text-muted-foreground">
                Dushanba - Juma: 09:00 - 18:00
                <br />
                Shanba - Yakshanba: 10:00 - 16:00
              </p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-6 rounded-lg"
          >
            <Input
              placeholder="Ismingiz"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              placeholder="Mavzu"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Xabaringiz"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full p-2 border rounded-lg resize-none h-32"
              required
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Yuborish
            </Button>
          </motion.form>
        </div>
      </motion.div>
    </Container>
  );
}
