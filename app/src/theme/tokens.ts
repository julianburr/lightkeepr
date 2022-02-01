import { opacify } from "polished";

import { createPalette } from "src/@packages/sol/tokens";

const palette = {
  sand: createPalette({ baseColor: "#e0dfd8" }),
  turquoise: createPalette({ baseColor: "#3dc5ce" }),
  red: createPalette({ baseColor: "#f5737f" }),
  yellow: createPalette({ baseColor: "#ffcb7c" }),
  green: createPalette({ baseColor: "#b7de86" }),
  grey: createPalette({ baseColor: "#646360" }),
};

const color = {
  white: "#fff",
  black: "#000",
  brand: palette.turquoise,
  error: palette.red,
  warning: palette.yellow,
  success: palette.green,
};

const spacing = {
  xxs: ".2rem",
  xs: ".4rem",
  s: ".8rem",
  m: "1.2rem",
  l: "1.6rem",
  xl: "2.4rem",
  xxl: "3.2rem",
  "3xl": "4rem",
  "4xl": "5.2rem",
  "5xl": "6.4rem",
};

const border = {
  width: {
    none: "0 none",
    thin: ".1rem solid",
    thick: ".2rem solid",
  },

  radius: {
    s: ".3rem",
    l: ".8rem",
  },
};

const typography = {
  size: {
    xs: ".8rem",
    s: "1.2rem",
    m: "1.5rem",
    l: "1.8rem",
    xl: "2.1rem",
    xxl: "2.4rem",
    "3xl": "3.2rem",
  },

  color: {
    default: color.black,
    grey: palette.grey[500],
    contrast: color.white,

    link: {
      default: color.brand[600],
      hover: color.brand[700],
      active: color.brand[800],
    },
  },
};

const container = {
  primary: {
    background: color.brand[500],
    foreground: typography.color.contrast,
    border: border.width.none,

    hover: {
      background: color.brand[600],
    },

    active: {
      background: color.brand[700],
    },
  },

  secondary: {
    background: palette.sand[400],
    foreground: typography.color.default,
    border: border.width.none,

    hover: {
      background: palette.sand[500],
    },

    active: {
      background: palette.sand[600],
    },
  },

  danger: {
    background: color.error[500],
    foreground: typography.color.contrast,
    border: border.width.none,

    hover: {
      background: color.error[600],
    },

    active: {
      background: color.error[700],
    },
  },

  error: {
    background: color.error[500],
    foreground: typography.color.contrast,
    border: border.width.none,

    hover: {
      background: color.error[600],
    },

    active: {
      background: color.error[700],
    },
  },

  ghost: {
    background: "transparent",
    foreground: typography.color.default,
    border: border.width.none,

    hover: {
      background: opacify(-0.8, palette.sand[600]),
    },

    active: {
      background: opacify(-0.7, palette.sand[600]),
    },
  },

  outline: {
    background: "transparent",
    foreground: typography.color.default,
    border: border.width.thin,
    borderColor: opacify(-0.8, palette.grey[500]),

    hover: {
      borderColor: opacify(-0.7, palette.grey[500]),
    },

    active: {
      borderColor: opacify(-0.6, palette.grey[500]),
    },
  },

  light: {
    background: palette.sand[50],
    foreground: typography.color.default,
    border: border.width.none,

    hover: {
      background: palette.sand[100],
    },

    active: {
      background: palette.sand[100],
    },
  },

  lighter: {
    background: "transparent",
    foreground: typography.color.default,
    border: border.width.none,

    hover: {
      background: palette.sand[50],
    },

    active: {
      background: palette.sand[100],
    },
  },
};

const input = {
  height: {
    s: "2.8rem",
    m: "3.6rem",
    l: "4.4rem",
  },

  border: {
    width: border.width.thin,
    radius: border.radius.s,
    color: {
      default: opacify(-0.8, palette.grey[500]),
      error: color.error[500],
      hover: {
        default: opacify(-0.7, palette.grey[500]),
        error: color.error[600],
      },
    },
  },
};

export const tokens = {
  palette,
  color,
  spacing,
  border,
  typography,
  container,
  input,
} as const;
