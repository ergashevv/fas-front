import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";

interface PriceProps {
  price: number;
  oldPrice?: number;
  className?: string;
}

export const Price = ({ price, oldPrice, className = "" }: PriceProps) => (
  <div className={`flex flex-col ${className}`}>
    {oldPrice && (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xs text-gray-400 line-through font-medium"
      >
        {formatPrice(oldPrice)}
      </motion.div>
    )}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
    >
      {formatPrice(price)}
    </motion.div>
  </div>
);
