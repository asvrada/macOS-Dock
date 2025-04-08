function normalDistribution(x, mean, stdDev) {
  const exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
  return Math.exp(exponent);
  // const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  // return coefficient * Math.exp(exponent);
}

function normalDistributionWithDeadZone(x, mean, stdDev, deadZone) {
  if (Math.abs(x) < deadZone) {
    return 1;
  }

  const newX = x < 0 ? x + deadZone : x - deadZone;
  return normalDistribution(newX, mean, stdDev);
}

export { normalDistribution, normalDistributionWithDeadZone };
