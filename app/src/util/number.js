export const scale = (z, a, b, c, d) => {
  return (z - a) * (d - c) / (b - a) + c;
}
