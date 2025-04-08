function calAreaHelper(x, graph) {
  // Check out of bound
  if (x <= -graph.width) {
    return 0;
  }

  if (x >= graph.width) {
    return graph.height * graph.width;
  }

  const base = graph.width - Math.abs(x);
  const height = (graph.height / graph.width) * base;

  if (x < 0) {
    return (base * height) / 2;
  } else {
    return graph.height * graph.width - (base * height) / 2;
  }
}

// For a graph y = -x where x >= 0
// Calculate the area under the graph between x1 and x2
// Graph should be an object
// height: 1
// width is half the length of base
// width: 1
function calArea(x1, x2, graph) {
  return calAreaHelper(x2, graph) - calAreaHelper(x1, graph);
}

function calAreaWithDeadzoneHelper(x, graph) {
  // Check out of bound
  if (x <= -(graph.width + graph.deadzone)) {
    return 0;
  }
  if (x >= graph.width + graph.deadzone) {
    // Return full
    return graph.height * graph.width + 2 * graph.height * graph.deadzone;
  }

  if (Math.abs(x) <= graph.deadzone) {
    // the full left triangle + deadzone portion
    return (
      (graph.width * graph.height) / 2 + graph.height * (graph.deadzone + x)
    );
  }

  const base = graph.width - (Math.abs(x) - graph.deadzone);
  const height = (graph.height / graph.width) * base;

  if (x < -graph.deadzone) {
    // Left small triangle
    return (base * height) / 2;
  } else {
    // full - right small triangle
    return (
      graph.width * graph.height +
      2 * graph.height * graph.deadzone -
      (base * height) / 2
    );
  }
}

// Graph
// x, y, deadzone
// Deadzone is a number, half length of the deadzone
function calAreaWithDeadzone(x1, x2, graph) {
  return (
    calAreaWithDeadzoneHelper(x2, graph) - calAreaWithDeadzoneHelper(x1, graph)
  );
}

export { calArea, calAreaWithDeadzone };
