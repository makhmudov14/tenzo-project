import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// RootState type
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type
export type AppDispatch = typeof store.dispatch;