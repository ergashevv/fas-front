import { Container } from "@/components/core/Container";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { formatPrice, calculateShipping, calculateTax } from "@/lib/format";
import { Plus, Minus, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart();
  const subtotal = total();
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const cartTotal = subtotal + shipping + tax;

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
        <motion.div
          className="absolute bottom-20 right-10 w-6 h-6 bg-purple-200 rounded-full opacity-30"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <Container className="py-12 relative z-10">
      <h1 className="text-3xl font-bold mb-8">Savat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
              <p className="text-muted-foreground text-lg mb-4">Savat bo'sh</p>
              <Link to="/products">
                <Button>Mahsulotlarni ko'rish</Button>
              </Link>
            </div>
          ) : (
            <motion.div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-28 sm:h-28 h-40 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/products/${item.slug}`}>
                        <h3 className="font-bold text-base md:text-lg hover:text-primary transition-colors">{item.title}</h3>
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.color && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            Rang: <span className="font-semibold">{item.color}</span>
                          </span>
                        )}
                        {item.size && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            O'lcham: <span className="font-semibold">{item.size}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-bold text-lg md:text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatPrice(item.price * item.qty)}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 border-2 border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQty(item.productId, item.qty - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 font-bold min-w-[2rem] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, item.qty + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 h-fit sticky top-20 shadow-lg"
          >
            <h2 className="font-bold text-lg mb-6">Savat xulasasi</h2>
            <div className="space-y-3 mb-4 pb-4 border-b text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Oraliq jami</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yetkazish</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-bold" : "font-semibold"}
                >
                  {shipping === 0 ? "Bepul" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Soliq</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Jami</span>
              <span className="text-primary">{formatPrice(cartTotal)}</span>
            </div>

            {subtotal < 150000 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-700">
                <p>150,000 so'mdan ortiq sotib olsangiz, bepul yetkazish!</p>
                <p className="font-bold">
                  Yana {formatPrice(150000 - subtotal)} kerak
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold">Promo kod</label>
                <div className="flex gap-2">
                  <Input placeholder="Kod kiriting" className="text-sm" />
                  <Button size="sm" variant="outline">
                    Qo'llash
                  </Button>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="block mt-6">
              <Button className="w-full bg-primary hover:bg-primary/90 h-12">
                Checkout
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="w-full mt-2">
                Davom etish
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </Container>
    </div>
  );
}
