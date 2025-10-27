import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingStars } from "@/components/common/RatingStars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send, Image as ImageIcon, LogIn } from "lucide-react";
import { useAuth } from "@/store/useAuth";

interface CommentFormProps {
  onSubmit: (comment: {
    rating: number;
    title: string;
    content: string;
    size?: string;
    color?: string;
  }) => void;
  loading?: boolean;
}

export const CommentForm = ({ onSubmit, loading }: CommentFormProps) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && title.trim() && content.trim()) {
      onSubmit({
        rating,
        title: title.trim(),
        content: content.trim(),
        size: size.trim() || undefined,
        color: color.trim() || undefined,
      });
      // Reset form
      setRating(0);
      setTitle("");
      setContent("");
      setSize("");
      setColor("");
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-8 text-center">
            <LogIn className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sharh qoldirish uchun tizimga kiring
            </h3>
            <p className="text-gray-600 mb-6">
              Mahsulot haqida sharh qoldirish uchun avval ro'yxatdan o'tishingiz kerak
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Kirish
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">
                  Ro'yxatdan o'tish
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Star className="w-6 h-6 text-yellow-500" />
            Sharh qoldiring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Baholang *
              </Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-colors duration-200"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 && `${rating} yulduz`}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                Sarlavha *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sharhingiz uchun qisqa sarlavha yozing..."
                className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
                Sharh *
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Mahsulot haqida batafsil sharh yozing..."
                rows={4}
                className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 resize-none"
                required
              />
            </div>

            {/* Size and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-semibold text-gray-700">
                  O'lcham
                </Label>
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Masalan: 104"
                  className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-semibold text-gray-700">
                  Rang
                </Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Masalan: Ko'k"
                  className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading || rating === 0 || !title.trim() || !content.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Sharh yuborish
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
