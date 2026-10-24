import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  query: string;
  category: string | null; // single select -> category slug
  minPrice: number | null;
  maxPrice: number | null;
  brands: string[]; // multi select
  page: number;
  sidebarOpen: boolean;
}

const initialState: FilterState = {
  query: '',
  category: null,
  minPrice: null,
  maxPrice: null,
  brands: [],
  page: 1,
  sidebarOpen: true,
};

// Every change to the result set sends the user back to page 1.
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload;
      state.brands = []; // brand list depends on the category
      state.page = 1;
    },
    setPriceRange(
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 1;
    },
    toggleBrand(state, action: PayloadAction<string>) {
      const brand = action.payload;
      state.brands = state.brands.includes(brand)
        ? state.brands.filter((b) => b !== brand)
        : [...state.brands, brand];
      state.page = 1;
    },
    clearFilters(state) {
      state.query = '';
      state.category = null;
      state.minPrice = null;
      state.maxPrice = null;
      state.brands = [];
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  setQuery,
  setCategory,
  setPriceRange,
  toggleBrand,
  clearFilters,
  setPage,
  toggleSidebar,
} = filterSlice.actions;
export default filterSlice.reducer;