import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export const RatingStars = ({
  rating = 0,
  count,
  size = "md",
}: RatingStarsProps) => {
  const sizeMap = { sm: 16, md: 20, lg: 24 };
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      size={sizeMap[size]}
      className={`${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
    />
  ));

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">{stars}</div>
      {rating > 0 && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {count && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
};
