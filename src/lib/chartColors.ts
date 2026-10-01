import type { ResolvedTheme } from "../hooks/useTheme";

export function chartColors(theme: ResolvedTheme) {
  return theme === "dark"
    ? {
        surface: "#1a1a19",
        gridline: "#2c2c2a",
        textMuted: "#898781",
        textSecondary: "#c3c2b7",
        series1: "#3987e5",
        series2: "#d95926",
        series3: "#199e70",
        good: "#0ca30c",
        critical: "#e66767",
      }
    : {
        surface: "#fcfcfb",
        gridline: "#e1e0d9",
        textMuted: "#898781",
        textSecondary: "#52514e",
        series1: "#2a78d6",
        series2: "#eb6834",
        series3: "#1baf7a",
        good: "#0ca30c",
        critical: "#d03b3b",
      };
}
