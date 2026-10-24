import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import FilterSidebar from '../../components/FilterSidebar';
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import ProductCard, { ProductCardSkeleton } from '../../components/ProductCard';
import { useDebounce } from '../../hooks/useDebounce';
import { clearFilters, setPage, setQuery, toggleSidebar } from '../../app/filter/filterSlice';
import { fetchBrands, fetchCategories, fetchProducts, PAGE_SIZE } from '../../app/product/productSlice';
import { logoutUser } from '../../app/auth/authThunks';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

const ProductListing = () => {
  const dispatch = useAppDispatch();
  const { items, total, loading, error } = useAppSelector((state) => state.products);
  const { query, category, minPrice, maxPrice, brands, page, sidebarOpen } =
    useAppSelector((state) => state.filters);

  // Navbar + sidebar search boxes share one value
  const [search, setSearch] = useState(query);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch !== query) dispatch(setQuery(debouncedSearch));
  }, [debouncedSearch, dispatch, query]);

  // Categories: load once
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Brands: reload when the category changes
  useEffect(() => {
    const request = dispatch(fetchBrands(category));
    return () => request.abort();
  }, [dispatch, category]);

  // Products: reload on any filter / page change; abort stale requests
  useEffect(() => {
    const request = dispatch(fetchProducts({ page, query, category, minPrice, maxPrice, brands }));
    return () => request.abort();
  }, [dispatch, page, query, category, minPrice, maxPrice, brands]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // A restored page can be out of range if the data changed
  useEffect(() => {
    if (!loading && totalPages > 0 && page > totalPages) dispatch(setPage(1));
  }, [dispatch, loading, page, totalPages]);

  const hasActiveFilters =
    !!query || !!category || minPrice !== null || maxPrice !== null || brands.length > 0;

  const handleClear = () => {
    setSearch('');
    dispatch(clearFilters());
  };

  const handlePageChange = (p: number) => {
    dispatch(setPage(p));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => dispatch(toggleSidebar())}
        onLogout={() => dispatch(logoutUser())}
      />

      <div className="flex flex-col md:flex-row">
        {sidebarOpen && (
          <FilterSidebar
            key={`${minPrice ?? ''}:${maxPrice ?? ''}`}
            search={search}
            onSearchChange={setSearch}
          />
        )}

        <main className="min-w-0 flex-1 px-6 py-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <SlidersHorizontal size={22} /> Filters
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              {!loading && <span>{total} products</span>}
              {hasActiveFilters && (
                <button onClick={handleClear} className="font-medium text-blue-600 hover:underline">
                  Clear all
                </button>
              )}
            </div>
          </div>

          {error && <p className="rounded-md bg-red-50 p-4 text-center text-red-600">{error}</p>}

          {!error && !loading && items.length === 0 && (
            <p className="py-20 text-center text-slate-500">No products match your filters.</p>
          )}

          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
              sidebarOpen ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-4'
            }`}
          >
            {loading
              ? Array.from({ length: PAGE_SIZE }, (_, i) => <ProductCardSkeleton key={i} />)
              : items.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
            windowSize={5}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductListing;