import { Comment as CommentType } from "@shared/api";
import { motion } from "framer-motion";
import { RatingStars } from "@/components/common/RatingStars";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Flag, CheckCircle } from "lucide-react";
import { useState } from "react";

interface CommentProps {
  comment: CommentType;
  onHelpful?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
}

export const Comment = ({ comment, onHelpful, onReport }: CommentProps) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      onHelpful?.(comment.id);
    }
  };

  const handleReport = () => {
    if (!isReported) {
      setIsReported(true);
      onReport?.(comment.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {comment.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{comment.userName}</h4>
              {comment.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RatingStars rating={comment.rating} size="sm" />
              <span>{formatDate(comment.date)}</span>
            </div>
          </div>
        </div>
        
        {/* Purchase info */}
        {(comment.size || comment.color) && (
          <div className="text-sm text-gray-500">
            {comment.size && <span>Sizes: {comment.size}</span>}
            {comment.color && <span className="ml-2">Color: {comment.color}</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h5 className="font-semibold text-gray-900 text-lg">{comment.title}</h5>
        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
        
        {/* Images */}
        {comment.images && comment.images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {comment.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={isHelpful}
            className={`flex items-center gap-1 ${
              isHelpful ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{isHelpful ? 'Foydali' : 'Foydali'}</span>
            <span className="text-xs">({comment.helpful})</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            disabled={isReported}
            className={`flex items-center gap-1 ${
              isReported ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>{isReported ? 'Shikoyat qilindi' : 'Shikoyat qilish'}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
