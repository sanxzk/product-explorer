interface StarRatingProps {
  rating: number;
  max?: number;
}

// Gray stars underneath, yellow stars on top clipped to the rating %.
const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
  const percent = Math.min(100, Math.max(0, (rating / max) * 100));
  const stars = '★'.repeat(max);

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative text-lg leading-none" aria-label={`${rating} out of ${max} stars`}>
        <span className="text-slate-300">{stars}</span>
        <span
          className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-amber-400"
          style={{ width: `${percent}%` }}
        >
          {stars}
        </span>
      </div>
      <span className="text-sm text-slate-600">({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;