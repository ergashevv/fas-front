import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Order } from "@shared/api";
import { Container } from "@/components/core/Container";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/format";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`order-${id}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    }
  }, [id]);

  if (!order) {
    return (
      <Container className="py-12 text-center">
        <p className="text-muted-foreground text-lg">Buyurtma topilmadi</p>
        <Link to="/products">
          <Button className="mt-4">Mahsulotlarni ko'rish</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Buyurtma tasdiqlandi!</h1>
        <p className="text-muted-foreground">
          Buyurtma raqami: <span className="font-bold">{order.id}</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border rounded-lg p-6"
          >
            <h2 className="font-bold text-lg mb-4">Buyurtma Ma'lumotlari</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Sana</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="border rounded-lg p-6"
          >
            <h2 className="font-bold text-lg mb-4">Mahsulotlar</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 pb-4 border-b">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.color && `Rang: ${item.color}`}
                      {item.size && ` | O'lcham: ${item.size}`}
                      {` | Soni: x${item.qty}`}
                    </p>
                  </div>
                  <p className="font-bold">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border rounded-lg p-6"
          >
            <h2 className="font-bold text-lg mb-4">Yetkazish Manzili</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Ism:</span>{" "}
                {order.address.fullName}
              </p>
              <p>
                <span className="text-muted-foreground">Telefon:</span>{" "}
                {order.address.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Mamlakat:</span>{" "}
                {order.address.country}
              </p>
              <p>
                <span className="text-muted-foreground">Shahar:</span>{" "}
                {order.address.city}
              </p>
              <p>
                <span className="text-muted-foreground">Manzil:</span>{" "}
                {order.address.street}
              </p>
              <p>
                <span className="text-muted-foreground">Zip:</span>{" "}
                {order.address.zip}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border rounded-lg p-6 h-fit sticky top-20"
        >
          <h2 className="font-bold text-lg mb-6">Xulasa</h2>
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Yetkazish</span>
              <span>
                {order.totals.shipping === 0
                  ? "Bepul"
                  : formatPrice(order.totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Soliq</span>
              <span>{formatPrice(order.totals.tax)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Jami</span>
            <span className="text-primary">
              {formatPrice(order.totals.total)}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <Link to="/products">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Davom etish
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                Profil
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
