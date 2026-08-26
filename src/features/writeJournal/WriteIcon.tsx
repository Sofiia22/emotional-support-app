import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

type IconName = "back" | "chevron" | "edit" | "trash" | "check" | "lock" | "book" | "search";

export function WriteIcon({ name, size = 22, color = "#7A5C4D" }: { name: IconName; size?: number; color?: string }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === "back" ? <Polyline points="15 18 9 12 15 6" {...common} /> : null}
      {name === "chevron" ? <Polyline points="9 18 15 12 9 6" {...common} /> : null}
      {name === "edit" ? <><Path d="M4 20h4L19 9l-4-4L4 16v4Z" {...common} /><Line x1="13" y1="7" x2="17" y2="11" {...common} /></> : null}
      {name === "trash" ? <><Polyline points="4 7 20 7" {...common} /><Path d="M9 7V4h6v3m3 0-1 13H7L6 7" {...common} /><Line x1="10" y1="11" x2="10" y2="17" {...common} /><Line x1="14" y1="11" x2="14" y2="17" {...common} /></> : null}
      {name === "check" ? <><Circle cx="12" cy="12" r="9" {...common} /><Polyline points="8 12 11 15 16 9" {...common} /></> : null}
      {name === "lock" ? <><Rect x="5" y="10" width="14" height="10" rx="2" {...common} /><Path d="M8 10V7a4 4 0 0 1 8 0v3" {...common} /></> : null}
      {name === "book" ? <><Path d="M3 5.5A9 9 0 0 1 12 7v13a9 9 0 0 0-9-1.5v-13Z" {...common} /><Path d="M21 5.5A9 9 0 0 0 12 7v13a9 9 0 0 1 9-1.5v-13Z" {...common} /></> : null}
      {name === "search" ? <><Circle cx="11" cy="11" r="7" {...common} /><Line x1="16" y1="16" x2="21" y2="21" {...common} /></> : null}
    </Svg>
  );
}
