import { useSelector, useDispatch } from "react-redux";

import { enter, leave, update } from "../stores/cursorSlice";

function Block({ num }) {
  return <div className="outline inline h-16 w-16 text-center">{num}</div>;
}

function Dock() {
  const dispatch = useDispatch();

  // make 10 blocks
  const blocks = [];
  for (let i = 0; i < 10; i++) {
    blocks.push(<Block key={i} num={i} />);
  }
  return (
    <div
      className="bg-yellow-100 flex justify-center"
      onMouseEnter={() => {
        dispatch(enter());
      }}
      onMouseLeave={() => {
        dispatch(leave());
      }}
      onMouseMove={(event) => {
        dispatch(update(event.clientX));
        // console.log(event.clientX, event.clientY);
      }}
    >
      {blocks}
    </div>
  );
}

export default Dock;
