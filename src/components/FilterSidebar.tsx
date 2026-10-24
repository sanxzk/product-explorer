import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCategory,
  setPage,
  setPriceRange,
  toggleBrand,
} from '../app/filter/filterSlice';
import { fetchBrands, fetchCategories } from '../app/product/productSlice';
import type { AppDispatch, RootState } from '../app/store';
import { useDebounce } from '../hooks/useDebounce';

const parsePrice = (value: string): number | null => {
  if (value.trim() === '') return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : Number.NaN;
};

interface FilterSidebarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const Divider = () => <hr className="my-5 border-slate-200" />;

const FilterSidebar = ({ search, onSearchChange }: FilterSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    categories,
    categoriesLoading,
    categoriesError,
    brands,
    brandsLoading,
    brandsError,
  } = useSelector((s: RootState) => s.products);
  const {
    category,
    minPrice,
    maxPrice,
    brands: selectedBrands,
  } = useSelector((s: RootState) => s.filters);

  // Keep text drafts local, then commit valid ranges after a short pause.
  const [min, setMin] = useState(minPrice?.toString() ?? '');
  const [max, setMax] = useState(maxPrice?.toString() ?? '');
  const debouncedMin = useDebounce(min, 300);
  const debouncedMax = useDebounce(max, 300);

  const draftMin = parsePrice(min);
  const draftMax = parsePrice(max);
  const priceError =
    Number.isNaN(draftMin) || Number.isNaN(draftMax)
      ? 'Enter valid prices greater than or equal to zero.'
      : draftMin !== null && draftMax !== null && draftMin > draftMax
        ? 'Minimum price cannot be greater than maximum price.'
        : '';

  useEffect(() => {
    const nextMin = parsePrice(debouncedMin);
    const nextMax = parsePrice(debouncedMax);
    if (
      Number.isNaN(nextMin) ||
      Number.isNaN(nextMax) ||
      (nextMin !== null && nextMax !== null && nextMin > nextMax)
    ) {
      return;
    }
    if (nextMin !== minPrice || nextMax !== maxPrice) {
      dispatch(setPriceRange({ min: nextMin, max: nextMax }));
    }
  }, [debouncedMin, debouncedMax, dispatch, minPrice, maxPrice]);

  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-slate-100 p-5 md:w-72">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <Divider />

      {/* Categories: single select (click the selected one again to clear) */}
      <h3 className="mb-3 text-lg font-semibold text-slate-900">Categories</h3>
      {categoriesLoading && <p className="text-sm text-slate-500">Loading categories…</p>}
      {categoriesError && (
        <div role="alert" className="mb-3 text-sm text-red-600">
          <p>{categoriesError}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchCategories())}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}
      <ul className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
        {categories.map((c) => (
          <li key={c.slug}>
            <label className="flex cursor-pointer items-center gap-3 text-slate-800">
              <input
                type="checkbox"
                checked={category === c.slug}
                onChange={() => dispatch(setCategory(category === c.slug ? null : c.slug))}
                className="h-5 w-5 accent-blue-500"
              />
              {c.name}
            </label>
          </li>
        ))}
      </ul>

      <Divider />

      <h3 className="mb-3 text-lg font-semibold text-slate-900">Price Range</h3>
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          value={min}
          onChange={(e) => {
            setMin(e.target.value);
            dispatch(setPage(1));
          }}
          placeholder="Min"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          min={0}
          value={max}
          onChange={(e) => {
            setMax(e.target.value);
            dispatch(setPage(1));
          }}
          placeholder="Max"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {priceError && <p className="mt-2 text-sm text-red-600">{priceError}</p>}
      <p className="mt-2 text-xs text-slate-500">Results update as you enter a valid range.</p>

      <Divider />

      <h3 className="mb-3 text-lg font-semibold text-slate-900">Brands</h3>
      {brandsLoading ? (
        <p className="text-sm text-slate-500">Loading brands…</p>
      ) : brandsError ? (
        <div role="alert" className="text-sm text-red-600">
          <p>{brandsError}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchBrands(category))}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      ) : brands.length === 0 ? (
        <p className="text-sm text-slate-500">No brands available</p>
      ) : (
        <ul className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-3 text-slate-800">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => dispatch(toggleBrand(brand))}
                  className="h-5 w-5 accent-blue-500"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default FilterSidebar;