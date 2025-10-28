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

  const [region, setRegion] = useState<{ code: string; name: string } | null>(() => {
    const code = localStorage.getItem("fas.region-code");
    const name = localStorage.getItem("fas.region-name");
    return code && name ? { code, name } : null;
  });
  const [delivery, setDelivery] = useState<{ method: "courier_door" | "pickup"; fee: number; etaDays: number }>({ method: "courier_door", fee: 0, etaDays: 2 });
  const [paymentMethod, setPaymentMethod] = useState<"payme" | "click" | "cod">("cod");

  if (items.length === 0) {
    return (
      <Container className="py-12 text-center">
        <p className="text-lg text-muted-foreground mb-4">Savat bo'sh</p>
        <Button onClick={() => navigate("/products")}>Mahsulot tanlash</Button>
      </Container>
    );
  }

  const handlePlaceOrder = async () => {
    if (!region) { return toast.error("Iltimos, viloyatni tanlang"); }

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      items,
      totals: { subtotal, shipping, tax, total: cartTotal },
      status: "processing" as const,
      address: formData,
    };

    try {
      // Create backend order for payment flow
      const res = await fetch(`/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        number: order.id,
        items: items,
        totals: { itemsTotal: subtotal, deliveryFee: shipping, discount: 0, grandTotal: cartTotal },
        region,
        address: { city: formData.city, street: formData.street },
        contact: { fullName: formData.fullName, phone: formData.phone },
        delivery: { method: delivery.method, fee: shipping, etaDays: delivery.etaDays },
        payment: { method: paymentMethod, status: 'awaiting_payment' }
      })});
      const created = await res.json();

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/payment/success?orderId=${created._id}`);
        return;
      }

      if (paymentMethod === 'payme') {
        const p = await fetch(`/api/payments/payme/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: created._id, amount: cartTotal })});
        const data = await p.json();
        window.location.href = data.redirectUrl;
      } else if (paymentMethod === 'click') {
        const p = await fetch(`/api/payments/click/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: created._id, amount: cartTotal })});
        const data = await p.json();
        window.location.href = data.redirectUrl;
      }
    } catch {
      toast.error("Xatolik yuz berdi");
    }
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
                <h2 className="font-bold text-lg mb-6">To‘lov turi</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{ borderColor: paymentMethod === "payme" ? "#7b68ee" : "#ccc" }}>
                    <input type="radio" name="payment" value="payme" checked={paymentMethod === "payme"} onChange={() => setPaymentMethod("payme")} className="w-4 h-4" />
                    <span className="ml-3 font-semibold">Payme</span>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{ borderColor: paymentMethod === "click" ? "#7b68ee" : "#ccc" }}>
                    <input type="radio" name="payment" value="click" checked={paymentMethod === "click"} onChange={() => setPaymentMethod("click")} className="w-4 h-4" />
                    <span className="ml-3 font-semibold">Click</span>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{ borderColor: paymentMethod === "cod" ? "#7b68ee" : "#ccc" }}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="w-4 h-4" />
                    <span className="ml-3 font-semibold">Naqd (kuryerga)</span>
                  </label>
                </div>

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
                      {paymentMethod === "payme" ? "Payme" : paymentMethod === "click" ? "Click" : "Naqd"}
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
