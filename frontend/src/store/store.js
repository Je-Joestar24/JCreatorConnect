import { configureStore } from '@reduxjs/toolkit';
// Import reducers here when created
// import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice.js';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    theme: themeReducer,
    // Add more reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

// Type exports for TypeScript (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

