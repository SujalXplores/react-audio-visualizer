export const createGradient = (
  ctx: CanvasRenderingContext2D,
  type: "linear" | "radial",
  colors: string[],
  width: number,
  height: number,
  radius?: number
) => {
  if (!colors || colors.length < 2) return colors[0];

  let gradient;
  if (type === "linear") {
    gradient = ctx.createLinearGradient(0, height, 0, 0);
  } else {
    gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      radius || 0
    );
  }

  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });

  return gradient;
};
