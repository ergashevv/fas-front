import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/core/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingStars } from "@/components/common/RatingStars";
import { Comment } from "@shared/api";
import { useAuth } from "@/store/useAuth";
import { api } from "@/lib/api";
import { ArrowLeft, Calendar, Star, MessageSquare, Package } from "lucide-react";
import { toast } from "sonner";


export default function MyComments() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    const loadComments = async () => {
      try {
        setLoading(true);
        const userComments = await api.comments.getByUser(user.id);
        setComments(userComments);
      } catch (error) {
        console.error("Sharhlarni yuklashda xatolik:", error);
        toast.error("Sharhlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Orqaga
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                Mening sharhlarim
              </h1>
              <p className="text-gray-600 mt-1">
                Jami {comments.length} ta sharh yozgansiz
              </p>
            </div>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Hech qanday sharh yozilmagan
                </h3>
                <p className="text-gray-600 mb-6">
                  Hali birorta mahsulotga sharh yozmabsiz. Xarid qilgan mahsulotlaringizga sharh yozishni unutmang!
                </p>
                <Button onClick={() => navigate("/products")} className="bg-purple-600 hover:bg-purple-700">
                  Mahsulotlarni ko'rish
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Mahsulot ma'lumotlari */}
                          {typeof comment.productId === 'object' && (
                            <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
                              <img 
                                src={comment.productId.images[0]} 
                                alt={comment.productId.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{comment.productId.title}</p>
                                <p className="text-sm text-gray-600">{comment.productId.price.toLocaleString()} so'm</p>
                              </div>
                            </div>
                          )}
                          
                          <CardTitle className="text-lg text-purple-900 mb-2">
                            {comment.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {comment.date}
                            </div>
                            {comment.size && (
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                O'lcham: {comment.size}
                              </div>
                            )}
                            {comment.color && (
                              <div className="flex items-center gap-1">
                                Rang: {comment.color}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <RatingStars rating={comment.rating} />
                          <div className="text-sm text-gray-600 mt-1">
                            {comment.rating} / 5 yulduz
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {comment.content}
                      </p>
                      
                      {comment.images && comment.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {comment.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Sharh rasmi ${imgIndex + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {comment.helpful} kishi foydali deb topgan
                          {comment.verified && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Tasdiqlangan xaridor
                            </span>
                          )}
                        </div>
                        
                        {/* Mahsulot sahifasiga o'tish */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const productSlug = typeof comment.productId === 'object'
                              ? comment.productId.slug 
                              : comment.productId;
                            navigate(`/products/${productSlug}`);
                          }}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          Mahsulotni ko'rish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
}