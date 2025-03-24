import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./stores/counterSlice";
import cursorReducer from "./stores/cursorSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    cursor: cursorReducer,
  },
});
