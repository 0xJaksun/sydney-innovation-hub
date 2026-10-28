import { describe, expect, it } from "vitest";
import { isHubOpen } from "./hours";

// Sydney is UTC+11 in summer (AEDT), UTC+10 in winter (AEST).
describe("isHubOpen", () => {
  it("open on a weekday afternoon", () => {
    expect(isHubOpen(new Date("2026-10-28T05:44:00Z"))).toBe(true); // Wed 16:44 AEDT
  });
  it("closed at 4:45pm sharp", () => {
    expect(isHubOpen(new Date("2026-10-28T05:45:00Z"))).toBe(false); // Wed 16:45 AEDT
  });
  it("closed before 9am", () => {
    expect(isHubOpen(new Date("2026-10-27T21:59:00Z"))).toBe(false); // Wed 08:59 AEDT
  });
  it("open at 9am", () => {
    expect(isHubOpen(new Date("2026-10-27T22:00:00Z"))).toBe(true); // Wed 09:00 AEDT
  });
  it("closed on weekends", () => {
    expect(isHubOpen(new Date("2026-10-31T01:00:00Z"))).toBe(false); // Sat 12:00 AEDT
  });
  it("handles winter time", () => {
    expect(isHubOpen(new Date("2026-07-01T06:44:00Z"))).toBe(true); // Wed 16:44 AEST
    expect(isHubOpen(new Date("2026-07-01T06:45:00Z"))).toBe(false); // Wed 16:45 AEST
  });
});
