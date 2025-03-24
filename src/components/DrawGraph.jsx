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

import { normalDistribution } from "../utils/normal_distribution";

// Return list of [{x, y}]
function computeData() {
  let data = [];

  for (let x = -8; x <= 8; x += 0.5) {
    let y = normalDistribution(x, 0, 2);
    data.push({ x, y });
  }

  return data;
}

function DrawGraph() {
  const data = computeData();
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

export default DrawGraph;
