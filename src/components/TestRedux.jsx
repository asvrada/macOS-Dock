import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../stores/counterSlice";

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const cursorHovering = useSelector((state) => state.cursor.hovering);
  const cursorX = useSelector((state) => state.cursor.x);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
      <div className="outline p-2">
        Cursor
        <div>Hovering: {cursorHovering ? "true" : "false"}</div>
        <div>X: {cursorX}</div>
      </div>
    </div>
  );
}
