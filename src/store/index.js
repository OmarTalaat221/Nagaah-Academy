import { configureStore } from "@reduxjs/toolkit";
import { rooReducer } from "./rootReducer";

export const store = configureStore({
  reducer: rooReducer,
});
