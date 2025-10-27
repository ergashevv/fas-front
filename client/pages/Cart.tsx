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
    <div className="min-h-screen bg-cart bg-pattern-waves relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 bg-yellow-100 rounded-full opacity-40"
          animate={{ y: [0, -22, 0], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 right-20 w-10 h-10 bg-yellow-200 rounded-full opacity-30"
          animate={{ y: [0, 18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-14 h-14 bg-yellow-100 rounded-full opacity-35"
          animate={{ y: [0, -15, 0], x: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-8 h-8 bg-yellow-200 rounded-full opacity-40"
          animate={{ y: [0, 25, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <Container className="py-12 relative z-10">
      <h1 className="text-3xl font-bold mb-8">Savat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 border rounded-lg p-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.color && `Rang: ${item.color}`}
                      {item.size && ` | O'lcham: ${item.size}`}
                    </p>
                    <p className="font-bold text-primary mt-2">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <X size={20} />
                    </button>
                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
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
            className="border rounded-lg p-6 h-fit sticky top-20"
          >
            <h2 className="font-bold text-lg mb-6">Savat xulasasi</h2>
            <div className="space-y-3 mb-4 pb-4 border-b text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Yetkazish</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-bold" : ""}
                >
                  {shipping === 0 ? "Bepul" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Soliq</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Jami</span>
              <span className="text-primary">{formatPrice(cartTotal)}</span>
            </div>

            {subtotal < 150000 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
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
