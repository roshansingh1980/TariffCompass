type Props = {
  className?: string;
  /** "full" keeps the route trail — use at 48px and above. "icon" drops it. */
  variant?: "full" | "icon";
};

/**
 * TariffCompass mark — a compass rose whose heading needle doubles as the
 * trade route: a trail of dots behind it, a red heading breaking the bezel.
 *
 * Colours follow the app's neutral tokens with #C8102E as the only accent.
 * Below 48px use variant="icon": the trail turns to mud and the bezel needs
 * the heavier stroke to survive a 1px screen line.
 */
export function TcMark({ className, variant = "icon" }: Props) {
  const full = variant === "full";

  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="TariffCompass"
    >
      <circle
        cx="48"
        cy="48"
        r="34"
        strokeWidth={full ? 2 : 4}
        className="stroke-[#D4D4D4] dark:stroke-[#404040]"
      />
      <path
        d={full ? "M22 48 L48 43.5 L48 52.5 Z" : "M22 48 L48 43 L48 53 Z"}
        className="fill-[#A3A3A3] dark:fill-[#525252]"
      />
      <path
        d={full ? "M74 48 L48 43.5 L48 52.5 Z" : "M74 48 L48 43 L48 53 Z"}
        className="fill-[#171717] dark:fill-[#FAFAFA]"
      />
      {full && (
        <>
          <circle cx="48" cy="60" r="1.6" className="fill-[#A3A3A3] dark:fill-[#525252]" />
          <circle cx="48" cy="68.5" r="2.3" className="fill-[#A3A3A3] dark:fill-[#525252]" />
          <circle cx="48" cy="77" r="3" className="fill-[#A3A3A3] dark:fill-[#525252]" />
        </>
      )}
      <path
        d={full ? "M48 4 L53.5 52 L42.5 52 Z" : "M48 6 L55 52 L41 52 Z"}
        className="fill-[#C8102E] dark:fill-[#E11D2E]"
      />
    </svg>
  );
}
