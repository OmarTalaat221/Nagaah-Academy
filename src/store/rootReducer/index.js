import { combineReducers } from "@reduxjs/toolkit";
import tooltibReducer from "../reducers/tooltibReducer";

export const rooReducer = combineReducers({
  tooltib: tooltibReducer,
});
