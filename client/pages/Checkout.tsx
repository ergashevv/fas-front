import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/core/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/useCart";
import { formatPrice, calculateShipping, calculateTax } from "@/lib/format";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const subtotal = total();
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const cartTotal = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    fullName: "Javohir Karimov",
    phone: "+998 90 123 45 67",
    country: "Uzbekistan",
    city: "Toshkent",
    street: "Chilonzor 12-kv, 34-uy",
    zip: "100000",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  if (items.length === 0) {
    return (
      <Container className="py-12 text-center">
        <p className="text-lg text-muted-foreground mb-4">Savat bo'sh</p>
        <Button onClick={() => navigate("/products")}>Mahsulot tanlash</Button>
      </Container>
    );
  }

  const handlePlaceOrder = () => {
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      items,
      totals: { subtotal, shipping, tax, total: cartTotal },
      status: "processing" as const,
      address: formData,
    };

    localStorage.setItem(`order-${order.id}`, JSON.stringify(order));
    clearCart();
    toast.success("Buyurtma qabul qilindi!");
    navigate(`/orders/${order.id}`);
  };

  const steps = [
    { id: 1, label: "Yetkazish" },
    { id: 2, label: "To'lov" },
    { id: 3, label: "Tasdiqlash" },
  ];

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {s.id}
            </motion.div>
            <p className="ml-2 text-sm font-semibold">{s.label}</p>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step > s.id ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border rounded-lg p-6"
          >
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-6">Yetkazish Manzili</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="To'liq Ismi"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Mamlakat"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Shahar"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Ko'cha"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="col-span-2"
                  />
                  <Input
                    placeholder="Zip Kodi"
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-6">To'lov Usuli</h2>
                <div className="space-y-3">
                  <label
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{
                      borderColor:
                        paymentMethod === "card" ? "#e74c3c" : "#ccc",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-semibold">
                      Kredit Kartasi (Mock)
                    </span>
                  </label>
                  <label
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{
                      borderColor:
                        paymentMethod === "cash" ? "#e74c3c" : "#ccc",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-semibold">
                      Yetkazish vaqtida to'lash
                    </span>
                  </label>
                </div>
                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-lg">
                    <Input placeholder="Karta Raqami (16 raqam)" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVC" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-6">
                  Buyurtmani Tasdiqlang
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span>Manzil:</span>
                    <span className="font-semibold">
                      {formData.city}, {formData.street}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>To'lov:</span>
                    <span className="font-semibold">
                      {paymentMethod === "card" ? "Karta" : "Yetkazishda"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          className="border rounded-lg p-6 h-fit sticky top-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="font-bold text-lg mb-6">Xulasa</h2>
          <div className="space-y-3 mb-4 text-sm max-h-48 overflow-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.title} x{item.qty}
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Yetkazish</span>
              <span>{shipping === 0 ? "Bepul" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Soliq</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
            <span>Jami</span>
            <span className="text-primary">{formatPrice(cartTotal)}</span>
          </div>

          <div className="space-y-2">
            {step < 3 && (
              <>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setStep(step + 1)}
                >
                  Davom etish
                </Button>
                {step > 1 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(step - 1)}
                  >
                    Orqaga
                  </Button>
                )}
              </>
            )}
            {step === 3 && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handlePlaceOrder}
              >
                Buyurtmani Tasdiqlash
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
