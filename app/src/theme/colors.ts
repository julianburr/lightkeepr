import Color from "color";

type GetColorsListArgs = {
  baseColor: string;
  amount?: number;
  shift: number;
  mix: string;
  rotate: number;
  saturation: number;
};

function getColorsList({
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

type PaletteArgs = {
  baseColor: string;
};

export function getPalette({ baseColor }: PaletteArgs) {
  const darkColors = getColorsList({
    baseColor,
    mix: "#000",
    shift: 55,
    rotate: 0,
    saturation: 20,
  });

  const lightColors = getColorsList({
    baseColor,
    mix: "#fff",
    shift: 80,
    rotate: 16,
    saturation: 10,
  });

  return [...lightColors.reverse(), baseColor, ...darkColors].reduce<{
    [key: string]: string;
  }>((all, color, index) => {
    all[index === 0 ? 50 : index === 10 ? 950 : index * 100] = color;
    return all;
  }, {});
}
