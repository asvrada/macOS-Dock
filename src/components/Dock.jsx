import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";

import { enter, leave, update } from "../stores/cursorSlice";
import {
  init,
  setTimestamp,
  setActualSize,
  setActualOffset,
  swap,
  incrementTimestampByAmount,
} from "../stores/animationSlice";

import { calAreaWithDeadzone } from "../utils/triangle";

const COUNT = 13;
const WIDTH = 50;
const SIZE_GROW = 26;

const calOffset = (rect, clientX) => {
  const globalOffsetX = clientX - rect.left;

  return globalOffsetX;
};

const calIdx = (globalOffsetX, blockWidth) => {
  // The range of globalOffsetX is [0, COUNT * blockWidth]
  // When it is at COUNT * blockWidth, the calculated index will be COUNT
  // So we need to minus 1 to make it [0, COUNT - 1]
  const blockIdx = Math.floor(globalOffsetX / blockWidth);
  return Math.min(COUNT - 1, blockIdx);
};

/**
 *
 * @param {idx} the index of this block, 0-based
 * @param {isHovering} is mouse hovering over Dock?
 * @param {hovering} index of the block cursor is hovering
 * @param {content} Content of this block to display
 * @param {size} width and height (they are the same) of this block
 * @returns
 */
function VirtualBlock({ idx, isHovering, hovering, content, size }) {
  const bg = isHovering && idx === hovering ? "bg-yellow-200" : "bg-yellow-100";

  // Scale content within the block
  const scale = 0.85;

  return (
    <div
      className="inline-flex justify-center"
      style={{ width: size, height: size * scale }}
    >
      <div
        style={{
          width: size * scale,
          height: size * scale,
          fontSize: size * scale * 0.8,
          lineHeight: Math.round(size * scale) + "px",
        }}
        className={`${bg} box-border border text-center`}
      >
        {content}
      </div>
    </div>
  );
}

function VirtualDock() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  const containerRef = useRef(null);

  const animation = useSelector((state) => state.animation);
  const cursor = useSelector((state) => state.cursor);
  // The index of the block cursor is hovering right now
  const cursorIdx = calIdx(cursor.globalOffsetX, WIDTH);
  // Local offset X in the block
  // Center of block is 0
  // So we minus half of the block width
  const offsetX = cursor.globalOffsetX - WIDTH / 2 - cursorIdx * WIDTH;

  const leftWidth = calAreaWithDeadzone(
    -100,
    -1 - cursorIdx + 0.5 - offsetX / WIDTH,
    { width: 2.2, height: SIZE_GROW, deadzone: 0.75 }
  );
  const rightWidth = calAreaWithDeadzone(
    COUNT - cursorIdx - 0.5 - offsetX / WIDTH,
    100,
    { width: 2.2, height: SIZE_GROW, deadzone: 0.75 }
  );

  useEffect(() => {
    dispatch(init({ count: COUNT, size: WIDTH }));
    setReady(true);
  }, [dispatch]);

  if (!ready) {
    return <div>Loading... </div>;
  }

  const blocks = [];
  for (let i = 0; i < COUNT; i++) {
    // The target size of this block
    let targetSize = WIDTH;

    if (cursor.hovering) {
      const sizeIncrease = calAreaWithDeadzone(
        i - cursorIdx - 0.5 - offsetX / WIDTH,
        i - cursorIdx + 0.5 - offsetX / WIDTH,
        { width: 2.2, height: SIZE_GROW, deadzone: 0.75 }
      );

      // Round to 1 decimal place
      targetSize = Math.round((WIDTH + sizeIncrease) * 10) / 10;
    }

    // lerp actual size given current size and target size
    const currentSize = animation.currentSizes[i];
    const newSize =
      currentSize +
      (targetSize - currentSize) * (animation.timestamp / animation.duration);

    dispatch(setActualSize({ idx: i, size: newSize }));

    blocks.push(
      <VirtualBlock
        key={i}
        idx={i}
        isHovering={cursor.hovering}
        hovering={cursorIdx}
        content={i}
        size={newSize}
      />
    );
  }

  // lerp the offset of entire container
  // lerp both way! 0 -> width, and width -> 0
  let targetOffset = leftWidth > 0 ? leftWidth / 2 : -rightWidth / 2;
  if (!cursor.hovering) {
    targetOffset = 0;
  }
  let actualOffset =
    animation.currentOffset +
    (targetOffset - animation.currentOffset) *
      (animation.timestamp / animation.duration);
  dispatch(setActualOffset(actualOffset));

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        style={{ left: actualOffset }}
        className="relative flex justify-center items-end"
      >
        {blocks}
      </div>
    </div>
  );
}

function PhysicalBlock({ num, grow }) {
  // 8 is the bottom margin
  const baseHeight = WIDTH + 8;
  const growHeight = grow ? baseHeight + SIZE_GROW * 0.5 : baseHeight;

  return (
    <div
      style={{ height: growHeight, width: WIDTH }}
      className="box-border border inline text-center"
    >
      {num}
    </div>
  );
}

function PhysicalDock() {
  const dispatch = useDispatch();
  const isHovering = useSelector((state) => state.cursor.hovering);
  const containerRef = useRef(null);

  // make 10 blocks
  const blocks = [];
  for (let i = 0; i < COUNT; i++) {
    blocks.push(<PhysicalBlock key={i} num={i} grow={isHovering} />);
  }

  return (
    <div className="flex justify-center cursor-pointer">
      <div
        ref={containerRef}
        className="bg-yellow-100 flex justify-center"
        onMouseEnter={() => {
          // Set up sizes
          dispatch(init({ count: COUNT, size: WIDTH }));

          // Set animation timestamp
          dispatch(setTimestamp(0));
          dispatch(enter());
        }}
        onMouseLeave={() => {
          // Set up sizes
          dispatch(swap());

          // Set animation timestamp
          dispatch(setTimestamp(0));
          dispatch(leave());
        }}
        onMouseMove={(event) => {
          const globalOffset = calOffset(
            containerRef.current.getBoundingClientRect(),
            event.clientX
          );

          dispatch(
            update({
              globalOffsetX: globalOffset,
              offsetX: event.nativeEvent.offsetX,
            })
          );
        }}
      >
        {blocks}
      </div>
    </div>
  );
}

function Dock() {
  const dispatch = useDispatch();

  useEffect(() => {
    setInterval(() => {
      dispatch(incrementTimestampByAmount(1000 / 69));
    }, 1000 / 60);
  }, [dispatch]);

  return (
    <>
      <div className="fixed bottom-2 w-screen">
        <VirtualDock />
      </div>

      <div className="fixed opacity-0 bottom-0 w-screen">
        <PhysicalDock />
      </div>
    </>
  );
}

export default Dock;
