import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Stars({ 
  rating, 
  count = 0, 
  showCount = true, 
  size = "md", 
  className 
}: StarsProps) {
  // Convert rating to number of full, half and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const textSizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg"
  }[size];
  
  const starClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }[size];
  
  return (
    <div className={cn("flex items-center text-amber-500", className)}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <i key={`full-${i}`} className={`fas fa-star ${starClass}`}></i>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <i className={`fas fa-star-half-alt ${starClass}`}></i>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <i key={`empty-${i}`} className={`far fa-star ${starClass}`}></i>
      ))}
      
      {showCount && (
        <span className={`text-gray-700 ml-1 ${textSizeClass}`}>
          {rating.toFixed(1)} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
}
