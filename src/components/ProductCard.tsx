import type { Product } from '../types/Product';
import StarRating from '../components/StarRating';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={`/product/${product.id}`}
    aria-label={`View ${product.title}`}
    className="block rounded-lg bg-white p-5 text-left text-inherit no-underline shadow-md transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
  >
    <div className="flex h-44 items-center justify-center border-b border-slate-100 pb-3">
      <img
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
        className="h-full max-w-full object-contain"
      />
    </div>
    <h3 className="mt-4 truncate text-lg font-medium text-slate-900" title={product.title}>
      {product.title}
    </h3>
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-xl font-medium text-slate-900">${product.price}</span>
      <StarRating rating={product.rating} />
    </div>
  </Link>
);

export const ProductCardSkeleton = () => (
  <div className="animate-pulse rounded-lg bg-white p-5 shadow-md">
    <div className="h-44 rounded bg-slate-200" />
    <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
    <div className="mt-3 h-5 w-1/2 rounded bg-slate-200" />
  </div>
);

export default ProductCard;