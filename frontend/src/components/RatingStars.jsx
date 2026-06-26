import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ value, text, size = 16 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      // Solid Star
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-gold text-gold"
        />
      );
    } else if (value >= i - 0.5) {
      // Half Star
      stars.push(
        <StarHalf
          key={i}
          size={size}
          className="fill-gold text-gold"
        />
      );
    } else {
      // Empty Star
      stars.push(
        <Star
          key={i}
          size={size}
          className="text-gray-300 fill-transparent"
        />
      );
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-0.5">{stars}</div>
      {text && <span className="text-xs text-gray-500 ml-1.5 font-sans">({text})</span>}
    </div>
  );
};

export default RatingStars;
