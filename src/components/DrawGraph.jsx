import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  normalDistribution,
  normalDistributionWithDeadZone,
} from "../utils/normal_distribution";

// Return list of [{x, y}]
function computeData1() {
  let data = [];

  for (let x = -7; x <= 7; x += 0.5) {
    let y = normalDistribution(x, 0, 2);
    data.push({ x, y });
  }

  return data;
}

function DrawGraph1() {
  const data = computeData1();
  return (
    <div>
      <h2>Normal Distribution (scaled)</h2>
      <div>
        <LineChart width={500} height={300} data={data}>
          <Tooltip />

          <XAxis dataKey="x" />
          <Line type="monotone" dataKey="y" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}

// Return list of [{x, y}]
function computeData2() {
  let data = [];

  for (let x = -7; x <= 7; x += 0.25) {
    let y = normalDistributionWithDeadZone(x, 0, 1, 0.15);
    data.push({ x, y });
  }

  return data;
}

// Draw the normal distribution with a deadzone
function DrawGraph2() {
  const data = computeData2();
  return (
    <div>
      <h2>Normal Distribution (with deadzone)</h2>
      <div>
        <LineChart width={500} height={300} data={data}>
          <Tooltip />

          <XAxis dataKey="x" />
          <Line type="monotone" dataKey="y" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}

function DrawGraph() {
  return (
    <div>
      <DrawGraph1 />
      <DrawGraph2 />
    </div>
  );
}

export default DrawGraph;
