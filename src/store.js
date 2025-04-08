import { configureStore } from "@reduxjs/toolkit";
import cursorReducer from "./stores/cursorSlice";
import animationReducer from "./stores/animationSlice";

export default configureStore({
  reducer: {
    cursor: cursorReducer,
    animation: animationReducer,
  },
});
