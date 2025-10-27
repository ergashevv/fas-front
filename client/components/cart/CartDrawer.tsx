import { useUI } from "@/store/useUI";
import { useCart } from "@/store/useCart";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";

export const CartDrawer = () => {
  const { showCartDrawer, setShowCartDrawer } = useUI();
  const { items, removeItem, updateQty, total } = useCart();

  return (
    <Drawer open={showCartDrawer} onOpenChange={setShowCartDrawer}>
      <div className="w-full max-w-md p-6 bg-white flex flex-col h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Savat</h2>
          <button onClick={() => setShowCartDrawer(false)} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-4 mb-6">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Savat bo'sh
            </p>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.color && `Rang: ${item.color}`}
                    {item.size && ` | O'lcham: ${item.size}`}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {formatPrice(item.price * item.qty)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    O'chirish
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Jami:</span>
              <span className="text-primary">{formatPrice(total())}</span>
            </div>
            <Link to="/cart" onClick={() => setShowCartDrawer(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 mb-2">
                Savatni ko'rish
              </Button>
            </Link>
            <Link to="/checkout" onClick={() => setShowCartDrawer(false)}>
              <Button className="w-full bg-secondary text-black hover:bg-secondary/90">
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Drawer>
  );
};
