import { Comment as CommentType } from "@shared/api";
import { Comment } from "./Comment";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";

interface CommentsListProps {
  comments: CommentType[];
  onHelpful?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export const CommentsList = ({ 
  comments, 
  onHelpful, 
  onReport, 
  onLoadMore, 
  hasMore, 
  loading 
}: CommentsListProps) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const filteredComments = filterRating 
    ? sortedComments.filter(comment => comment.rating === filterRating)
    : sortedComments;

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: comments.filter(c => c.rating === rating).length,
    percentage: comments.length > 0 
      ? (comments.filter(c => c.rating === rating).length / comments.length) * 100 
      : 0
  }));

  return (
    <div className="space-y-6">
      {/* Comments Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Sharhlar ({comments.length})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">O'rtacha:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </div>
              ))}
              <span className="ml-1 text-sm font-semibold text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating}</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 text-yellow-400 fill-current">★</div>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Saralash:</span>
        </div>
        
        {(['newest', 'oldest', 'rating'] as const).map((sort) => (
          <Button
            key={sort}
            variant={sortBy === sort ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(sort)}
            className={`text-xs ${
              sortBy === sort 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            {sort === 'newest' ? 'Yangi' : sort === 'oldest' ? 'Eski' : 'Reyting'}
          </Button>
        ))}

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm font-semibold text-gray-700">Filtr:</span>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
              className={`text-xs ${
                filterRating === rating 
                  ? 'bg-yellow-500 text-white' 
                  : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              {rating}★
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Comments */}
      <div className="space-y-4">
        {filteredComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Comment
              comment={comment}
              onHelpful={onHelpful}
              onReport={onReport}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            className="px-6 py-2 border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
              />
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Ko'proq ko'rish
              </>
            )}
          </Button>
        </motion.div>
      )}

      {filteredComments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Hozircha sharhlar yo'q
          </h3>
          <p className="text-gray-500">
            Birinchi sharhni siz qoldiring!
          </p>
        </motion.div>
      )}
    </div>
  );
};
