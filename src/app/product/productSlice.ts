import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../api/apiClient';
import type { Category, Product, ProductsResponse } from '../../types/Product';

const PRODUCTS_URL = '/products';
const SELECT = 'title,price,rating,thumbnail,brand';
export const PAGE_SIZE = 8;

export interface ProductQuery {
  page: number;
  query: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  brands: string[];
}

interface ListResult {
  products: Product[];
  total: number;
}

interface ProductState {
  items: Product[];
  total: number;
  selectedProduct: Product | null;
  detailLoading: boolean;
  detailError: string | null;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  brands: string[];
  brandsLoading: boolean;
  brandsError: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  total: 0,
  selectedProduct: null,
  detailLoading: false,
  detailError: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  brands: [],
  brandsLoading: false,
  brandsError: null,
  loading: false,
  error: null,
};

const errorMessage = (err: unknown): string => {
  if (axios.isAxiosError<{ message?: unknown }>(err)) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    return err.message || 'The request failed.';
  }
  return err instanceof Error ? err.message : 'Something went wrong.';
};

/**
 * dummyjson can paginate server-side (limit/skip) and filter by search OR category,
 * but it has NO price or brand filter, and can't combine search + category.
 * So:
 *  - no price/brand filter and not (search + category) -> server-side pagination
 *  - otherwise -> fetch the whole source list (limit=0), filter + paginate here
 */
export const fetchProducts = createAsyncThunk<
  ListResult,
  ProductQuery,
  { rejectValue: string }
>(
  'products/fetch',
  async (
    { page, query, category, minPrice, maxPrice, brands },
    { signal, rejectWithValue }
  ) => {
    try {
      const q = query.trim();
      const hasPrice = minPrice !== null || maxPrice !== null;
      const clientSide = hasPrice || brands.length > 0 || (!!q && !!category);

      let url = PRODUCTS_URL;
      if (category) url = `${PRODUCTS_URL}/category/${encodeURIComponent(category)}`;
      else if (q) url = `${PRODUCTS_URL}/search`;

      const skip = (page - 1) * PAGE_SIZE;

      const { data } = await apiClient.get<ProductsResponse>(url, {
        params: {
          q: !category && q ? q : undefined,
          limit: clientSide ? 0 : PAGE_SIZE, // limit=0 -> all items
          skip: clientSide ? 0 : skip,
          select: SELECT,
        },
        signal,
      });

      if (!clientSide) return { products: data.products, total: data.total };

      let list = data.products;
      if (q && category) {
        const needle = q.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(needle));
      }
      if (minPrice !== null) list = list.filter((p) => p.price >= minPrice);
      if (maxPrice !== null) list = list.filter((p) => p.price <= maxPrice);
      if (brands.length > 0) {
        list = list.filter((p) => p.brand && brands.includes(p.brand));
      }

      return { products: list.slice(skip, skip + PAGE_SIZE), total: list.length };
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'products/fetchCategories',
  async (_, { signal, rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<Category[]>(`${PRODUCTS_URL}/categories`, { signal });
      return data;
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>('products/fetchById', async (id, { signal, rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<Product>(`${PRODUCTS_URL}/${id}`, { signal });
    return data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

// Brands available for the current category (or all products)
export const fetchBrands = createAsyncThunk<
  string[],
  string | null,
  { rejectValue: string }
>(
  'products/fetchBrands',
  async (category, { signal, rejectWithValue }) => {
    try {
      const url = category
        ? `${PRODUCTS_URL}/category/${encodeURIComponent(category)}`
        : PRODUCTS_URL;
      const { data } = await apiClient.get<ProductsResponse>(url, {
        params: { limit: 0, select: 'brand' },
        signal,
      });
      const unique = new Set(
        data.products.map((p) => p.brand).filter((brand): brand is string => !!brand)
      );
      return [...unique].sort((a, b) => a.localeCompare(b));
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.aborted) return; // superseded by a newer request
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.error = action.payload ?? 'Failed to load products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedProduct = null;
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.detailLoading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.detailLoading = false;
        state.detailError = action.payload ?? 'Unable to load this product.';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.categoriesLoading = false;
        state.categoriesError = action.payload ?? 'Unable to load categories.';
      })
      .addCase(fetchBrands.pending, (state) => {
        state.brandsLoading = true;
        state.brandsError = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brandsLoading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.brandsLoading = false;
        state.brandsError = action.payload ?? 'Unable to load brands.';
      });
  },
});

export default productSlice.reducer;