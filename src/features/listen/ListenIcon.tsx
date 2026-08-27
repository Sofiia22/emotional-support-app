import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

export type ListenIconName = "back" | "bookmark" | "chevron" | "headphones" | "heartwave" | "leaf" | "mic" | "music" | "nature" | "pause" | "play" | "science" | "skipBack" | "skipForward" | "stop" | "voices";

export function ListenIcon({ name, size = 24, color = "#79594C", filled = false }: { name: ListenIconName; size?: number; color?: string; filled?: boolean }) {
  const line = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <Svg width={size} height={size} viewBox="0 0 24 24">
    {name === "back" ? <Polyline points="15 18 9 12 15 6" {...line} /> : null}
    {name === "chevron" ? <Polyline points="9 18 15 12 9 6" {...line} /> : null}
    {name === "bookmark" ? <Path d="M6 4h12v16l-6-4-6 4V4Z" {...line} fill={filled ? color : "none"} /> : null}
    {name === "headphones" ? <><Path d="M4 13a8 8 0 0 1 16 0" {...line} /><Rect x="3" y="12" width="5" height="8" rx="2" {...line} /><Rect x="16" y="12" width="5" height="8" rx="2" {...line} /></> : null}
    {name === "play" ? <Path d="m9 7 8 5-8 5V7Z" {...line} fill={filled ? color : "none"} /> : null}
    {name === "pause" ? <><Line x1="9" y1="7" x2="9" y2="17" {...line} /><Line x1="15" y1="7" x2="15" y2="17" {...line} /></> : null}
    {name === "stop" ? <Rect x="7" y="7" width="10" height="10" rx="1" {...line} /> : null}
    {name === "skipBack" ? <><Path d="M7 8V4l-4 4 4 4V8a8 8 0 1 1-1 8" {...line} /><Path d="M10 10v5m0-5-2 1m5-1h2v5h-2" {...line} /></> : null}
    {name === "skipForward" ? <><Path d="M17 8V4l4 4-4 4V8a8 8 0 1 0 1 8" {...line} /><Path d="M8 10v5m0-5-2 1m5-1h2v5h-2" {...line} /></> : null}
    {name === "music" ? <><Path d="M9 18V6l10-2v12" {...line} /><Circle cx="6" cy="18" r="3" {...line} /><Circle cx="16" cy="16" r="3" {...line} /></> : null}
    {name === "science" ? <><Path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" {...line} /><Path d="M8 15h8" {...line} /></> : null}
    {name === "nature" ? <Path d="M19 4C10 4 5 9 5 18c7 1 13-4 14-14ZM5 18c3-4 6-7 10-9" {...line} /> : null}
    {name === "voices" ? <><Circle cx="8" cy="9" r="3" {...line} /><Circle cx="17" cy="10" r="2.5" {...line} /><Path d="M2 20c0-4 2-6 6-6s6 2 6 6M14 15c4-1 7 1 8 5" {...line} /></> : null}
    {name === "mic" ? <><Rect x="8" y="3" width="8" height="12" rx="4" {...line} /><Path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" {...line} /></> : null}
    {name === "heartwave" ? <><Path d="M12 20S4 15 4 9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-6 11-6 11Z" {...line} /><Path d="m5 12 3-2 2 4 3-7 2 5 4-1" {...line} /></> : null}
    {name === "leaf" ? <Path d="M19 4C10 4 5 9 5 18c7 1 13-4 14-14ZM5 18l8-8" {...line} /> : null}
  </Svg>;
}
