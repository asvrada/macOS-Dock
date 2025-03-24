import DrawGraph from "./components/DrawGraph";
import Dock from "./components/Dock";
import { Counter } from "./components/TestRedux";

import "./App.css";

function App() {
  return (
    <>
      <Counter />
      <DrawGraph />
      <Dock />
    </>
  );
}

export default App;
