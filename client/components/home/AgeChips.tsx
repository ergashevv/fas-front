import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AGE_RANGES } from "@/lib/config";

// Age range icons and colors
const ageStyles = [
  { gradient: "from-pink-400 via-pink-500 to-rose-500", icon: "🍼", shadow: "shadow-pink-200" },
  { gradient: "from-purple-400 via-purple-500 to-indigo-500", icon: "👶", shadow: "shadow-purple-200" },
  { gradient: "from-blue-400 via-blue-500 to-cyan-500", icon: "🧸", shadow: "shadow-blue-200" },
  { gradient: "from-green-400 via-green-500 to-emerald-500", icon: "🎨", shadow: "shadow-green-200" },
  { gradient: "from-yellow-400 via-amber-500 to-orange-500", icon: "⚽", shadow: "shadow-yellow-200" },
  { gradient: "from-red-400 via-rose-500 to-pink-500", icon: "🎒", shadow: "shadow-red-200" },
  { gradient: "from-indigo-400 via-violet-500 to-purple-500", icon: "📚", shadow: "shadow-indigo-200" },
];

export const AgeChips = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Yoshga qarab tanlang
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-sm md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Har bir yosh uchun maxsus tanlangan kiyimlar
        </motion.p>
      </div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
      >
        {AGE_RANGES.map((age, index) => {
          const style = ageStyles[index % ageStyles.length];
          return (
            <Link key={age.value} to={`/products?age=${age.value}`}>
              <motion.div
                className={`relative group bg-gradient-to-br ${style.gradient} rounded-2xl p-4 md:p-5 text-white font-bold text-center cursor-pointer overflow-hidden shadow-lg ${style.shadow} hover:shadow-2xl transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full -ml-6 -mb-6 group-hover:scale-150 transition-transform duration-500" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div 
                    className="text-3xl md:text-4xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {style.icon}
                  </motion.div>
                  <div className="text-sm md:text-base font-bold tracking-wide">
                    {age.label}
                  </div>
                </div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
