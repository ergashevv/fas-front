import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AGE_RANGES } from "@/lib/config";

export const AgeChips = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Yoshga qarab tanlang</h2>
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {AGE_RANGES.map((age) => (
          <Link key={age.value} to={`/products?age=${age.value}`}>
            <motion.button
              className="px-4 py-2 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {age.label}
            </motion.button>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};
