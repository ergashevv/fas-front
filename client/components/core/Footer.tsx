import { Container } from "./Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/images/logos/logo.PNG" 
                alt="FAS KIDS" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-300">
              Bolalar uchun quvonchli, qulay va zamonaviy kiyimlar yaratamiz. Sifatli materiallar, xavfsiz dizaynlar va hamyonbop narxlar.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Havolalar</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/products" className="hover:text-white">
                  Mahsulotlar
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  Biz haqida
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Kontaktlar
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Yordam</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Qaytarish siyosati
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Shartlar
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Manzil</h4>
            <p className="text-sm text-gray-300">
              Toshkent, Chilonzor,
              <br />
              12-kv, 34-uy
              <br />
              Tel: +998 90 123 45 67
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="max-w-md mb-8">
            <h4 className="font-semibold mb-4">Yangiliklarga obuna bo'ling</h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Yuborish
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 FAS Kids. Hamma huquqlar himoyalangan.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
