import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  createMigrate,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';

import authReducer from './auth/authSlice';
import filterReducer from './filter/filterSlice';
import productReducer from './product/productSlice';

const filterPersistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['query', 'category', 'minPrice', 'maxPrice', 'brands', 'page', 'sidebarOpen'],
  migrate: createMigrate(
    {
      1: (state) => {
        if (!state) return state;

        const saved = state as Record<string, unknown>;
        const minPrice = saved.minPrice;
        const maxPrice = saved.maxPrice;

        return {
          ...state,
          query: typeof saved.query === 'string' ? saved.query : '',
          category: typeof saved.category === 'string' ? saved.category : null,
          minPrice:
            typeof minPrice === 'number' && Number.isFinite(minPrice) && minPrice >= 0
              ? minPrice
              : null,
          maxPrice:
            typeof maxPrice === 'number' && Number.isFinite(maxPrice) && maxPrice >= 0
              ? maxPrice
              : null,
          brands: Array.isArray(saved.brands)
            ? saved.brands.filter((brand): brand is string => typeof brand === 'string')
            : [],
          page:
            typeof saved.page === 'number' &&
            Number.isInteger(saved.page) &&
            saved.page > 0
              ? saved.page
              : 1,
          sidebarOpen:
            typeof saved.sidebarOpen === 'boolean' ? saved.sidebarOpen : true,
        };
      },
    },
    { debug: import.meta.env.DEV }
  ),
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  filters: persistReducer(filterPersistConfig, filterReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable actions
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;