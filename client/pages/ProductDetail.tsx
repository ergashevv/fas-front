import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Product, Comment, Category } from "@shared/api";
import { Container } from "@/components/core/Container";
import { Price } from "@/components/common/Price";
import { RatingStars } from "@/components/common/RatingStars";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { sleep } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CommentForm } from "@/components/product/CommentForm";
import { CommentsList } from "@/components/product/CommentsList";
import { RecommendedProducts } from "@/components/product/RecommendedProducts";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { Heart, Share2, ShoppingCart, Minus, Plus, Star, MessageCircle, Home, ChevronRight, ZoomIn, X, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      
      try {
        const found = await api.products.getBySlug(slug!);
        
        if (found) {
          setProduct(found);
          setSelectedColor(found.colors[0]);
          setSelectedSize(found.sizes[0]);
          
          // Load category
          if (found.categorySlug) {
            try {
              const categories = await api.categories.getAll();
              const foundCategory = categories.find((c: Category) => c.slug === found.categorySlug);
              setCategory(foundCategory || null);
            } catch (error) {
              console.error("Error loading category:", error);
            }
          }
          
          // Load recommended products
          if (found.recommendedProducts && found.recommendedProducts.length > 0) {
            try {
              const allProducts = await api.products.getAll();
              const recommended = allProducts.products.filter((p: Product) => 
                found.recommendedProducts!.includes(p.id)
              );
              setRecommendedProducts(recommended);
            } catch (error) {
              console.error("Error loading recommended products:", error);
            }
          }
          
          // Load similar products
          if (found.similarProducts && found.similarProducts.length > 0) {
            try {
              const allProducts = await api.products.getAll();
              const similar = allProducts.products.filter((p: Product) => 
                found.similarProducts!.includes(p.id)
              );
              setSimilarProducts(similar);
            } catch (error) {
              console.error("Error loading similar products:", error);
            }
          }
        }
        
        // Load comments
        try {
          const productComments = await api.comments.getByProduct(found?.id || "");
          setComments(productComments);
        } catch (error) {
          console.error("Error loading comments:", error);
        }
        
      } catch (error) {
        console.error("Error fetching product:", error);
        // Set product to null to trigger not found state
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;
    
    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      qty,
      color: selectedColor,
      size: selectedSize,
      image: product.images[0] || "/placeholder.svg",
    });
    
    toast.success("Mahsulot savatga qo'shildi!", {
      duration: 3000,
    });
  };

  const handleAddComment = (commentData: {
    rating: number;
    title: string;
    content: string;
    size?: string;
    color?: string;
  }) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      productId: product!.id,
      userId: "current-user",
      userName: "Siz",
      rating: commentData.rating,
      title: commentData.title,
      content: commentData.content,
      date: new Date().toISOString(),
      verified: false,
      helpful: 0,
      size: commentData.size,
      color: commentData.color,
    };
    
    setComments(prev => [newComment, ...prev]);
    toast.success("Sharhingiz qo'shildi!");
  };

  const handleHelpful = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, helpful: comment.helpful + 1 }
          : comment
      )
    );
  };

  const handleReport = (commentId: string) => {
    toast.info("Shikoyat qabul qilindi");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-product-detail bg-pattern-dots relative overflow-hidden">
        <Container className="py-12 relative z-10">
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-2xl" />
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded w-3/4" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
                <div className="bg-gray-200 h-6 rounded w-1/3" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-product-detail bg-pattern-dots relative overflow-hidden">
        <Container className="py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Mahsulot topilmadi</h2>
            <p className="text-gray-500 mb-6">Kechirasiz, bunday mahsulot mavjud emas</p>
            <Button onClick={() => navigate("/products")} className="bg-purple-600 hover:bg-purple-700">
              Mahsulotlarga qaytish
            </Button>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-product-detail bg-pattern-dots relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-10 h-10 bg-pink-100 rounded-full opacity-40"
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 right-20 w-12 h-12 bg-pink-200 rounded-full opacity-30"
          animate={{ y: [0, 18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-14 h-14 bg-pink-100 rounded-full opacity-35"
          animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-8 h-8 bg-pink-200 rounded-full opacity-40"
          animate={{ y: [0, 25, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <Container className="py-8 relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-6 overflow-x-auto pb-2"
        >
          <Link 
            to="/" 
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            <span>Bosh sahifa</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Link 
            to="/products" 
            className="text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
          >
            Mahsulotlar
          </Link>
          {category && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Link 
                to={`/category/${category.slug}`} 
                className="text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
              >
                {category.title}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 font-medium whitespace-nowrap">
            {product.title}
          </span>
        </motion.nav>

        {/* Product Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg group">
              <div className="relative cursor-pointer"
                   onClick={() => {
                     setSelectedImage(product.images[currentImageIndex] || "/placeholder.svg");
                     setIsZoomOpen(true);
                   }}>
                <img
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                {/* Zoom Icon Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <ZoomIn className="w-6 h-6 text-gray-800" />
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
              
              {product.oldPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </div>
              )}
            </div>
            
            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all flex-shrink-0 ${
                      currentImageIndex === index
                        ? 'border-purple-500 opacity-100'
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-purple-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <RatingStars rating={product.rating} size="md" />
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount || 0} sharh)
                    </span>
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.available ? 'Mavjud' : 'Tugagan'}
                </div>
              </div>
              <Price price={product.price} oldPrice={product.oldPrice} className="text-2xl" />
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Rang:</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color 
                        ? 'border-purple-500' 
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: getColorValue(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">O'lcham:</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold ${
                      selectedSize === size 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Miqdor:</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{qty}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.available || !selectedColor || !selectedSize}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Savatga qo'shish
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-4 ${
                  isWishlisted 
                    ? 'text-red-500 border-red-500' 
                    : 'text-gray-500 border-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="lg" className="px-4">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl">
              <TabsTrigger value="description" className="rounded-lg">
                Tavsif
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Sharhlar ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="recommended" className="rounded-lg">
                Tavsiyalar
              </TabsTrigger>
              <TabsTrigger value="similar" className="rounded-lg">
                O'xshash
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mahsulot haqida</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Material:</h4>
                    <p className="text-gray-600">{product.material}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parvarish:</h4>
                    <p className="text-gray-600">{product.care}</p>
                  </div>
                </div>
                
                {product.tags && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Teglar:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <CommentForm onSubmit={handleAddComment} />
              <CommentsList
                comments={comments}
                onHelpful={handleHelpful}
                onReport={handleReport}
              />
            </TabsContent>

            <TabsContent value="recommended">
              <RecommendedProducts products={recommendedProducts} />
            </TabsContent>

            <TabsContent value="similar">
              <SimilarProducts products={similarProducts} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Image Zoom Modal */}
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95">
            <DialogClose className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
              <X className="w-6 h-6 text-white" />
            </DialogClose>
            <div 
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair"
              onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                if (zoomLevel > 1) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setMousePosition({ x, y });
                }
              }}
              onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoomLevel(prev => Math.max(1, Math.min(3, prev + delta)));
              }}
            >
              <img
                src={selectedImage}
                alt={product?.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
}

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