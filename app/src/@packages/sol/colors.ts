import Color from "color";

type GetColorsListArgs = {
  baseColor: string;
  amount?: number;
  shift: number;
  mix: string;
  rotate: number;
  saturation: number;
};

export function getColorsList({
  baseColor,
  amount = 5,
  shift,
  mix,
  rotate,
  saturation,
}: GetColorsListArgs) {
  const colorsList = [];

  let step;
  for (step = 0; step < amount; step++) {
    colorsList.push(
      Color(baseColor)
        .rotate(((step + 1) / amount) * -rotate)
        .saturate(((step + 1) / amount) * (saturation / 100))
        .mix(Color(mix), ((shift / 100) * (step + 1)) / amount)
        .string()
    );
  }

  return colorsList;
}
