export default function genRandomNum(min, max) {
  const newMin = (min < max) ? min : max;
  const newMax = (min < max) ? max : min;

  return newMin + Math.random() * (newMax - newMin);
}
