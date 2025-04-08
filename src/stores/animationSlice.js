import { createSlice } from "@reduxjs/toolkit";

export const animationSlice = createSlice({
  name: "animation",
  initialState: {
    // Total animation duration, in ms
    duration: 100,
    // Current animation progress, in ms
    timestamp: 0,
    currentSizes: [],
    actualSizes: [],
    // Offset of all blocks
    currentOffset: 0,
    actualOffset: 0,
  },
  reducers: {
    init(state, action) {
      state.currentSizes = [];
      state.actualSizes = [];
      for (let i = 0; i < action.payload.count; i++) {
        state.currentSizes.push(action.payload.size);
        state.actualSizes.push(action.payload.size);
      }
      state.currentOffset = 0;
      state.actualOffset = 0;
    },
    setActualSize: (state, action) => {
      state.actualSizes[action.payload.idx] = action.payload.size;
    },
    swap: (state, action) => {
      state.currentSizes = state.actualSizes.slice();
      state.currentOffset = state.actualOffset;
    },
    setTimestamp: (state, action) => {
      state.timestamp = action.payload;
    },
    setActualOffset: (state, action) => {
      state.actualOffset = action.payload;
    },
    incrementTimestampByAmount: (state, action) => {
      state.timestamp += action.payload;
      if (state.timestamp > state.duration) {
        state.timestamp = state.duration;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  init,
  swap,
  setTimestamp,
  setActualSize,
  setActualOffset,
  incrementTimestampByAmount,
} = animationSlice.actions;

export default animationSlice.reducer;
