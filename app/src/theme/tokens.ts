import { getPalette } from "./colors";

export const tokens = {
  palette: {
    sand: getPalette({ baseColor: "#e0dfd8" }),
    turquoise: getPalette({ baseColor: "#3dc5ce" }),
    red: getPalette({ baseColor: "#f5737f" }),
    yellow: getPalette({ baseColor: "#ffcb7c" }),
    green: getPalette({ baseColor: "#b7de86" }),
    grey: getPalette({ baseColor: "#646360" }),
  },
} as const;
