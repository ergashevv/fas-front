import { Product } from "@shared/api";
import { Link } from "react-router-dom";
import { Price } from "@/components/common/Price";
import { RatingStars } from "@/components/common/RatingStars";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.slug}`} className="block h-full">
      <motion.div
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square w-full">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount Badge */}
          {product.oldPrice && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-[10px] md:text-sm font-bold shadow-lg"
            >
              -{discountPercentage}%
            </motion.div>
          )}
          
          {/* Availability Badge */}
          <div className="absolute top-1.5 left-1.5">
            {product.available ? (
              <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold flex items-center gap-0.5">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                <span className="hidden sm:inline">Mavjud</span>
                <span className="sm:hidden">✓</span>
              </div>
            ) : (
              <div className="bg-gray-500 text-white px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold">
                <span className="hidden sm:inline">Tugagan</span>
                <span className="sm:hidden">✗</span>
              </div>
            )}
          </div>

          {/* Quick View Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg hover:bg-white transition-colors">
              Tez ko'rish
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-2 md:p-3 space-y-1.5 md:space-y-2.5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-xs md:text-sm line-clamp-2 group-hover:text-purple-600 transition-colors duration-200 leading-tight min-h-[2rem] md:min-h-[2.5rem]">
            {product.title}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <RatingStars rating={product.rating} size="sm" />
              <span className="text-[10px] md:text-xs text-gray-500 font-medium">
                ({product.rating})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <Price price={product.price} oldPrice={product.oldPrice} />
            
            {/* Colors indicator */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-0.5 md:gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: getColorValue(color) }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gray-300 border border-white shadow-sm flex items-center justify-center text-[8px] md:text-[10px] font-bold text-gray-600">
                    +{product.colors.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Gender and Age */}
          <div className="flex items-center gap-1 md:gap-2 text-xs flex-wrap">
            <span className={`px-1.5 md:px-2 py-0.5 rounded-full font-semibold text-[9px] md:text-[11px] whitespace-nowrap ${
              product.gender === 'boy' 
                ? 'bg-blue-100 text-blue-700' 
                : product.gender === 'girl'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {product.gender === 'boy' ? '👦 O\'g\'il' : product.gender === 'girl' ? '👧 Qiz' : '👶'}
            </span>
            <span className="px-1.5 md:px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-[9px] md:text-[11px] whitespace-nowrap">
              {product.ageRange}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

// Helper function to get color values
const getColorValue = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'oq': '#ffffff',
    'qora': '#000000',
    'qizil': '#ef4444',
    'ko\'k': '#3b82f6',
    'yashil': '#22c55e',
    'sariq': '#eab308',
    'pushti': '#ec4899',
    'binafsha': '#8b5cf6',
    'jigarrang': '#a3a3a3',
    'kulrang': '#6b7280',
  };
  return colorMap[colorName.toLowerCase()] || '#e5e7eb';
};
