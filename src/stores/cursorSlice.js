import { createSlice } from "@reduxjs/toolkit";

export const cursorSlice = createSlice({
  name: "cursor",
  initialState: {
    hovering: false,
    // The global offset X in the container
    globalOffsetX: 0,
  },
  reducers: {
    enter: (state) => {
      state.hovering = true;
    },
    leave: (state) => {
      state.hovering = false;
    },
    update: (state, action) => {
      state.globalOffsetX = action.payload.globalOffsetX;
    },
  },
});

// Action creators are generated for each case reducer function
export const { enter, leave, update } = cursorSlice.actions;

export default cursorSlice.reducer;
