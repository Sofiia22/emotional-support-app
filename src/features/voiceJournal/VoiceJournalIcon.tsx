import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

export type VoiceJournalIconName =
  | "back"
  | "lock"
  | "mic"
  | "more"
  | "pause"
  | "play"
  | "rotate"
  | "save"
  | "stop"
  | "trash";

type VoiceJournalIconProps = {
  color?: string;
  name: VoiceJournalIconName;
  size?: number;
};

const strokeProps = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
};

export function VoiceJournalIcon({
  color = "#755447",
  name,
  size = 24,
}: VoiceJournalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      {name === "back" ? (
        <>
          <Line {...strokeProps} stroke={color} x1="19" y1="12" x2="5" y2="12" />
          <Path {...strokeProps} stroke={color} d="m11 18-6-6 6-6" />
        </>
      ) : null}
      {name === "mic" ? (
        <>
          <Rect {...strokeProps} stroke={color} x="8" y="2.5" width="8" height="13" rx="4" />
          <Path {...strokeProps} stroke={color} d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
          <Line {...strokeProps} stroke={color} x1="12" y1="18" x2="12" y2="22" />
          <Line {...strokeProps} stroke={color} x1="8.5" y1="22" x2="15.5" y2="22" />
        </>
      ) : null}
      {name === "pause" ? (
        <>
          <Rect x="6" y="4" width="4" height="16" rx="1.5" fill={color} />
          <Rect x="14" y="4" width="4" height="16" rx="1.5" fill={color} />
        </>
      ) : null}
      {name === "play" ? <Path d="m8 5 11 7-11 7V5Z" fill={color} /> : null}
      {name === "stop" ? <Rect x="6" y="6" width="12" height="12" rx="2" fill={color} /> : null}
      {name === "rotate" ? (
        <>
          <Path {...strokeProps} stroke={color} d="M20 11a8 8 0 1 0-2.3 5.7" />
          <Path {...strokeProps} stroke={color} d="M20 5v6h-6" />
        </>
      ) : null}
      {name === "trash" ? (
        <>
          <Path {...strokeProps} stroke={color} d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14" />
          <Line {...strokeProps} stroke={color} x1="10" y1="11" x2="10.5" y2="17" />
          <Line {...strokeProps} stroke={color} x1="14" y1="11" x2="13.5" y2="17" />
        </>
      ) : null}
      {name === "lock" ? (
        <>
          <Rect {...strokeProps} stroke={color} x="5" y="10" width="14" height="11" rx="3" />
          <Path {...strokeProps} stroke={color} d="M8 10V7a4 4 0 0 1 8 0v3" />
          <Circle cx="12" cy="15" r="1.2" fill={color} />
        </>
      ) : null}
      {name === "more" ? (
        <>
          <Circle cx="12" cy="5" r="1.5" fill={color} />
          <Circle cx="12" cy="12" r="1.5" fill={color} />
          <Circle cx="12" cy="19" r="1.5" fill={color} />
        </>
      ) : null}
      {name === "save" ? (
        <>
          <Path {...strokeProps} stroke={color} d="M6 19c6-1 10-5 12-13-7 1-11 5-12 13Z" />
          <Path {...strokeProps} stroke={color} d="M6 19c2-4 5-7 9-9" />
        </>
      ) : null}
    </Svg>
  );
}
