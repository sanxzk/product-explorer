import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StarRating from '../../components/StarRating';
import Navbar from '../../components/Navbar';
import { fetchProductById } from '../../app/product/productSlice';
import { setQuery } from '../../app/filter/filterSlice';
import { logoutUser } from '../../app/auth/authThunks';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const dispatch = useAppDispatch();
  const { selectedProduct, detailLoading, detailError } = useAppSelector(
    (state) => state.products
  );
  const query = useAppSelector((state) => state.filters.query);
  const [gallery, setGallery] = useState({ productId: 0, index: 0 });

  useEffect(() => {
    if (!Number.isSafeInteger(productId) || productId < 1) return;
    const request = dispatch(fetchProductById(productId));
    return () => request.abort();
  }, [dispatch, productId]);

  const images = selectedProduct?.images?.length
    ? selectedProduct.images
    : selectedProduct?.thumbnail
      ? [selectedProduct.thumbnail]
      : [];

  if (!Number.isSafeInteger(productId) || productId < 1) {
    return <ProductMessage message="Product not found." />;
  }

  if (detailLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">
        <p role="status">Loading product…</p>
      </main>
    );
  }

  if (detailError || !selectedProduct) {
    return <ProductMessage message={detailError ?? 'Product not found.'} />;
  }

  const product = selectedProduct;
  const activeImageIndex =
    gallery.productId === product.id
      ? Math.min(gallery.index, Math.max(0, images.length - 1))
      : 0;
  const selectImage = (index: number) =>
    setGallery({ productId: product.id, index });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        search={query}
        onSearchChange={(value) => dispatch(setQuery(value))}
        onLogout={() => dispatch(logoutUser())}
      />
      <main className="px-4 py-6 text-slate-900 sm:px-8">
        <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-100"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>

        <div className="grid gap-8 rounded-xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
          <section aria-label="Product images">
            <div className="flex min-h-80 items-center justify-center rounded-lg bg-slate-50 p-6 md:min-h-[480px]">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]}
                  alt={product.title}
                  className="max-h-[440px] w-full object-contain"
                />
              ) : (
                <p className="text-slate-500">No image available</p>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  aria-label="Previous product image"
                  onClick={() =>
                    selectImage((activeImageIndex - 1 + images.length) % images.length)
                  }
                  className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
                >
                  <ArrowLeft size={18} />
                </button>
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    onClick={() => selectImage(index)}
                    className={`h-12 w-12 rounded border p-1 ${
                      activeImageIndex === index ? 'border-blue-500' : 'border-slate-200'
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next product image"
                  onClick={() => selectImage((activeImageIndex + 1) % images.length)}
                  className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </section>

          <section>
            <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-semibold">${product.price.toFixed(2)}</span>
              <StarRating rating={product.rating} />
            </div>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
              {product.brand && (
                <>
                  <dt className="font-semibold">Brand</dt>
                  <dd>{product.brand}</dd>
                </>
              )}
              {product.category && (
                <>
                  <dt className="font-semibold">Category</dt>
                  <dd className="capitalize">{product.category.replaceAll('-', ' ')}</dd>
                </>
              )}
              {product.availabilityStatus && (
                <>
                  <dt className="font-semibold">Availability</dt>
                  <dd>{product.availabilityStatus}</dd>
                </>
              )}
            </dl>

            <section className="mt-7 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {product.description || 'No description is available for this product.'}
              </p>
              {(product.warrantyInformation || product.shippingInformation) && (
                <dl className="mt-5 grid gap-3 text-sm text-slate-600">
                  {product.warrantyInformation && (
                    <div>
                      <dt className="inline font-semibold text-slate-900">Warranty: </dt>
                      <dd className="inline">{product.warrantyInformation}</dd>
                    </div>
                  )}
                  {product.shippingInformation && (
                    <div>
                      <dt className="inline font-semibold text-slate-900">Shipping: </dt>
                      <dd className="inline">{product.shippingInformation}</dd>
                    </div>
                  )}
                </dl>
              )}
            </section>

            <section className="mt-7 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {product.reviews?.length ? (
                <ul className="mt-4 space-y-5">
                  {product.reviews.map((review, index) => (
                    <li key={`${review.date}-${review.reviewerName}-${index}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold">{review.reviewerName}</h3>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{review.comment}</p>
                      <time className="mt-1 block text-xs text-slate-500" dateTime={review.date}>
                        {new Date(review.date).toLocaleDateString()}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600">No reviews yet.</p>
              )}
            </section>
          </section>
        </div>
      </div>
      </main>
    </div>
  );
}

function ProductMessage({ message }: { message: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p role="alert" className="text-slate-700">{message}</p>
        <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">
          Browse products
        </Link>
      </div>
    </main>
  );
}
