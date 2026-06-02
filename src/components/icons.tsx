"use client";

export const PATHS: Record<string, string> = {
  bolt: "M13 3 4 14h6l-1 7 9-11h-6l1-7Z",
  shield: "M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z",
  check: "M5 12l4 4 10-10",
  clock: "M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  scale: "M12 3v18 M7 21h10 M6 7h12 M6 7 3 14h6L6 7Z M18 7l-3 7h6l-3-7Z",
  phone: "M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  message: "M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1Z",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M21 21l-4.5-4.5",
  bell: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6 M9.5 19a2.5 2.5 0 0 0 5 0",
  plus: "M12 5v14 M5 12h14",
  chevR: "M9 6l6 6-6 6",
  chevD: "M6 9l6 6 6-6",
  star: "M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.3L12 17.7 6.4 20.5l1.2-6.3L3 9.9l6.3-.8L12 3Z",
  lock: "M6 11V8a6 6 0 0 1 12 0v3 M5 11h14v9H5z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 21c0-4 3.5-6 8-6s8 2 8 6",
  briefcase: "M4 8h16v11H4z M9 8V5h6v3",
  file: "M7 3h7l4 4v14H7z M14 3v4h4",
  dollar: "M12 2v20 M16 6H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H8",
  arrowR: "M5 12h14 M13 6l6 6-6 6",
  arrowUR: "M7 17 17 7 M8 7h9v9",
  zap: "M13 3 4 14h6l-1 7 9-11h-6l1-7Z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z",
  inbox: "M3 13h5l1 3h6l1-3h5 M3 13l3-8h12l3 8v6H3z",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  doc: "M7 3h7l4 4v14H7z M14 3v4h4 M9 12h6 M9 16h6",
  pen: "M4 20l1-4L16 5l3 3L8 19l-4 1Z",
  plug: "M9 2v6 M15 2v6 M7 8h10v3a5 5 0 0 1-10 0V8Z M12 16v6",
  flag: "M5 21V4h11l-2 4 2 4H5",
  filter: "M3 5h18l-7 8v6l-4-2v-4L3 5Z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  x: "M6 6l12 12 M18 6 6 18",
  download: "M12 4v11 M8 11l4 4 4-4 M5 20h14",
  upload: "M12 20V9 M8 13l4-4 4 4 M5 5h14",
  refresh: "M20 11a8 8 0 1 0-1 5 M20 5v6h-6",
  card: "M3 7h18v11H3z M3 11h18",
  logout: "M14 4h5v16h-5 M10 12H3 M7 9l-4 3 4 3",
  building: "M4 21V4h10v17 M14 9h6v12 M7 8h2 M7 12h2 M7 16h2 M17 13h1 M17 17h1",
  graduation: "M12 4 2 9l10 5 10-5-10-5Z M6 12v4c0 1 3 2 6 2s6-1 6-2v-4",
};

export function Icon({
  name,
  size = 20,
  stroke = 1.75,
  color = "currentColor",
  style,
}: {
  name: string;
  size?: number;
  stroke?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const d = PATHS[name] || "";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}
