// Sydney startup hub opening hours. Innovation is permitted Mon-Fri, 9:00 to 16:45.
const OPEN = 9 * 60;
const CLOSE = 16 * 60 + 45;

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "Australia/Sydney",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function isHubOpen(when: Date): boolean {
  const parts = fmt.formatToParts(when);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  if (day === "Sat" || day === "Sun") return false;
  return minutes >= OPEN && minutes < CLOSE;
}

const ROASTS = [
  "**PR closed. Sydney does not innovate after 4:45pm.**\n\nThe hub's shut, the lights are off, and everyone's gone home. Apparently that's how you build a world-class startup ecosystem.",
  "**Fuck off, it's after hours.**\n\nThis is Sydney. Innovation clocks off at 4:45 sharp. Your idea can wait until 9am like everyone else's.",
  "**After-hours innovation is not permitted in Sydney.**\n\nWant a 24/7 startup hub? Wrong city. Your PR has been closed.",
];

export function pickRoast(): string {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)] ?? "";
}
