import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice.js';
import userReducer from './slices/userSlice.js';
import creatorProfileReducer from './slices/creatorProfileSlice.js';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    creatorProfile: creatorProfileReducer,
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

