import { createSlice } from "@reduxjs/toolkit";

/**
 * Animation slice for managing the Dock's lerp-based size and offset transitions.
 *
 * The animation system works by linearly interpolating (lerp) between a "current"
 * state and a "target" state over a fixed duration. Each frame, `timestamp` is
 * incremented by the frame delta, and the ratio `timestamp / duration` determines
 * how far along the transition we are (0 = start, 1 = complete).
 *
 * State:
 * @property {number} duration - Total animation duration in ms (fixed at 100ms)
 * @property {number} timestamp - Current animation progress in ms. Incremented each
 *   frame by ~16ms (60fps timer). Used as lerp factor: timestamp/duration.
 *   Reset to 0 on mouse enter/leave to restart the transition.
 * @property {number[]} currentSizes - The starting sizes (in px) for each block at
 *   the beginning of a transition. On mouse enter, initialized to base WIDTH.
 *   On mouse leave, swapped from actualSizes so blocks animate back to rest.
 * @property {number[]} actualSizes - The interpolated sizes (in px) currently being
 *   rendered for each block. Updated every frame during VirtualDock render.
 * @property {number} currentOffset - The starting horizontal offset (in px) of the
 *   dock container at the beginning of a transition.
 * @property {number} actualOffset - The interpolated horizontal offset (in px)
 *   currently applied to the dock container. Shifts the dock to keep it visually
 *   centered as icons grow asymmetrically.
 */
export const animationSlice = createSlice({
  name: "animation",
  initialState: {
    duration: 100,
    timestamp: 0,
    currentSizes: [],
    actualSizes: [],
    currentOffset: 0,
    actualOffset: 0,
  },
  reducers: {
    /**
     * Initialize all block sizes to a uniform value and reset offsets.
     * Called on mouse enter to set the starting state for the grow animation.
     *
     * @param {Object} action.payload
     * @param {number} action.payload.count - Number of blocks in the dock
     * @param {number} action.payload.size - Base size (px) for each block
     */
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
    /**
     * Update the rendered size of a specific block.
     * Called for each block every frame during VirtualDock render.
     *
     * @param {Object} action.payload
     * @param {number} action.payload.idx - Block index (0-based)
     * @param {number} action.payload.size - New interpolated size in px
     */
    setActualSize: (state, action) => {
      state.actualSizes[action.payload.idx] = action.payload.size;
    },
    /**
     * Snapshot the current rendered state as the new starting point.
     * Called on mouse leave so that the shrink animation begins from the
     * current magnified sizes/offset rather than jumping.
     */
    swap: (state, action) => {
      state.currentSizes = state.actualSizes.slice();
      state.currentOffset = state.actualOffset;
    },
    /**
     * Set the animation timestamp to an absolute value.
     * Typically set to 0 to restart a transition on mouse enter/leave.
     *
     * @param {number} action.payload - Timestamp value in ms
     */
    setTimestamp: (state, action) => {
      state.timestamp = action.payload;
    },
    /**
     * Update the rendered horizontal offset of the dock container.
     * Called every frame during VirtualDock render.
     *
     * @param {number} action.payload - New interpolated offset in px
     */
    setActualOffset: (state, action) => {
      state.actualOffset = action.payload;
    },
    /**
     * Advance the animation clock by a delta amount, clamped to duration.
     * Called by a global ~60fps interval timer in the Dock component.
     *
     * @param {number} action.payload - Time delta in ms (typically ~14.5ms for 69fps target)
     */
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
