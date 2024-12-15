import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";
import clickCounterReducer from './clickCounterSlice';
const store = configureStore({
  reducer: rootReducer,
  clickCounter: clickCounterReducer,
});

const { dispatch } = store;

export { store, dispatch };