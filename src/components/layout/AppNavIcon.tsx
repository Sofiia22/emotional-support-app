import Svg, { Line, Path, Rect } from "react-native-svg";

import type { AppSection } from "@/components/layout/AppScaffold";

type AppNavIconProps = {
  color: string;
  section: AppSection;
};

const common = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
};

export function AppNavIcon({ color, section }: AppNavIconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" accessibilityElementsHidden>
      {section === "home" ? (
        <>
          <Path {...common} d="M3.5 10.6 12 3.8l8.5 6.8" stroke={color} />
          <Path {...common} d="M5.5 9.4v10.1h13V9.4" stroke={color} />
          <Path {...common} d="M9.5 19.5v-5.8h5v5.8" stroke={color} />
        </>
      ) : null}

      {section === "journal" ? (
        <>
          <Rect {...common} x="5" y="3.5" width="14" height="17" rx="2.5" stroke={color} />
          <Line {...common} x1="8.5" y1="8" x2="15.5" y2="8" stroke={color} />
          <Line {...common} x1="8.5" y1="12" x2="15.5" y2="12" stroke={color} />
          <Line {...common} x1="8.5" y1="16" x2="13" y2="16" stroke={color} />
        </>
      ) : null}

      {section === "library" ? (
        <>
          <Path {...common} d="M3.5 5.2c3.2-.7 6 .1 8.5 2.1v12.1c-2.5-2-5.3-2.7-8.5-2V5.2Z" stroke={color} />
          <Path {...common} d="M20.5 5.2c-3.2-.7-6 .1-8.5 2.1v12.1c2.5-2 5.3-2.7 8.5-2V5.2Z" stroke={color} />
        </>
      ) : null}

      {section === "breathe" ? (
        <>
          <Path {...common} d="M12 4.3c-3.8 2.3-5.7 5.1-5.7 8.3A5.7 5.7 0 0 0 12 18.3" stroke={color} />
          <Path {...common} d="M12 4.3c3.8 2.3 5.7 5.1 5.7 8.3a5.7 5.7 0 0 1-5.7 5.7" stroke={color} />
          <Path {...common} d="M8.8 20.3c1.1-.8 2.2-1.1 3.2-1.1s2.1.3 3.2 1.1" stroke={color} />
        </>
      ) : null}

      {section === "support" ? (
        <Path
          {...common}
          d="M12 20.1 4.4 12.8C.5 8.9 6.2 3 10.2 6.7L12 8.4l1.8-1.7c4-3.7 9.7 2.2 5.8 6.1L12 20.1Z"
          stroke={color}
        />
      ) : null}
    </Svg>
  );
}
