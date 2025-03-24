function normalDistribution(x, mean, stdDev) {
  const exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
  return Math.exp(exponent);
  // const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  // return coefficient * Math.exp(exponent);
}

export { normalDistribution };
