import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  {
    id: "c1",
    slug: "tops",
    title: "Tunikalar",
    icon: "👕",
    color: "bg-pink-100",
  },
  {
    id: "c2",
    slug: "bottoms",
    title: "Shim-Shim",
    icon: "👖",
    color: "bg-blue-100",
  },
  {
    id: "c3",
    slug: "sets",
    title: "To'plamlar",
    icon: "👶",
    color: "bg-yellow-100",
  },
  {
    id: "c4",
    slug: "outerwear",
    title: "Kurtka",
    icon: "🧥",
    color: "bg-purple-100",
  },
  {
    id: "c5",
    slug: "shoes",
    title: "Oyoqkiym",
    icon: "👟",
    color: "bg-green-100",
  },
  {
    id: "c6",
    slug: "accessories",
    title: "Aksessuarlar",
    icon: "🧢",
    color: "bg-orange-100",
  },
];

export const CategorySlider = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Kategoriyalar</h2>
      <motion.div
        className="grid grid-cols-3 md:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((cat) => (
          <motion.div key={cat.id} variants={itemVariants}>
            <Link to={`/category/${cat.slug}`}>
              <motion.div
                className={`${cat.color} rounded-lg p-6 text-center cursor-pointer transition`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="text-sm font-semibold text-gray-800">
                  {cat.title}
                </p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
