import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Bolalar uchun eng yaxshi kiyimlar",
    subtitle: "Sifatli va qulay",
    image: "/images/hero/boys-banner.jpg",
    cta: { label: "O'g'il bolalar", link: "/gender/boy" },
  },
  {
    id: 2,
    title: "Qizlar uchun chegirmali to'plamlar",
    subtitle: "50% gacha chegirma",
    image: "/images/hero/girls-banner.jpg",
    cta: { label: "Qiz bolalar", link: "/gender/girl" },
  },
  {
    id: 3,
    title: "Aksessuarlar to'plami",
    subtitle: "Stilingiz tubuting",
    image: "/images/hero/accessuar.jpg",
    cta: { label: "Aksessuarlar", link: "/category/accessories" },
  },
];

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 bg-animated-gradient">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-8 h-8 bg-white/20 rounded-full"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-20 right-20 w-6 h-6 bg-white/20 rounded-full"
          animate={{ y: [0, 15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-10 h-10 bg-white/20 rounded-full"
          animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-4 h-4 bg-white/20 rounded-full"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12">
          <motion.div
            key={`${current}-text`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.1 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
            className="max-w-md"
          >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {slides[current].title}
          </h1>
          <p className="text-lg text-white/80 mb-6">
            {slides[current].subtitle}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={slides[current].cta.link}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {slides[current].cta.label}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition ${
              i === current ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
