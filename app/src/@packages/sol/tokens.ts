import flatten from "flat";

import { getColorsList } from "./colors";

type Palette = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

type CreatePaletteArgs = {
  baseColor: string;
};

export function createPalette({ baseColor }: CreatePaletteArgs): Palette {
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

  const allColors = [...lightColors.reverse(), baseColor, ...darkColors];
  return allColors.reduce<Partial<Palette>>((all, color, index) => {
    const key = index === 0 ? 50 : index === 10 ? 950 : index * 100;
    all[key as keyof Palette] = color;
    return all;
  }, {}) as Palette;
}

let prefix = "--sol-";
export function setPrefix(p: string) {
  prefix = p;
}

function parseVarName(varName: string) {
  return `${prefix}-${varName.replace(/\./g, "-")}`;
}

export function tokensToVars(tokens: any) {
  const flat: any = flatten(tokens);
  return Object.keys(flat)
    .map((varName) => `${parseVarName(varName)}: ${flat[varName]};`)
    .join("\n");
}

export function interactive(intent: string) {
  return `
    color: var(${prefix}-container-${intent}-foreground);
    background: var(${prefix}-container-${intent}-background);
    border: var(${prefix}-container-${intent}-border);
    border-color: var(${prefix}-container-${intent}-borderColor);

    &:focus, 
    &:hover {
      color: var(${prefix}-container-${intent}-hover-foreground,
        var(${prefix}-container-${intent}-foreground));
      background: var(${prefix}-container-${intent}-hover-background,
        var(${prefix}-container-${intent}-background));
      border: var(${prefix}-container-${intent}-hover-border, 
        var(${prefix}-container-${intent}-border));
      border-color: var(${prefix}-container-${intent}-hover-borderColor,
        var(${prefix}-container-${intent}-borderColor));
    }

    &:active, 
    &.active {
      color: var(${prefix}-container-${intent}-active-foreground,
        var(${prefix}-container-${intent}-foreground));
      background: var(${prefix}-container-${intent}-active-background,
        var(${prefix}-container-${intent}-background));
      border: var(${prefix}-container-${intent}-active-border, 
        var(${prefix}-container-${intent}-border));
      border-color: var(${prefix}-container-${intent}-active-borderColor,
        var(${prefix}-container-${intent}-borderColor));
    }
  `;
}
