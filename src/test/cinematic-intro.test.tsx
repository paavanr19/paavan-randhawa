import { act, fireEvent, render, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CinematicIntro } from "@/components/cinematic-intro";

describe("Intro playback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
  });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("finishes at 8.5 seconds, within the requested 8–9 seconds", () => {
    const done = vi.fn();
    render(<CinematicIntro onDone={done} />);
    act(() => vi.advanceTimersByTime(8499));
    expect(done).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(done).toHaveBeenCalledTimes(1);
  });
  it("allows immediate skipping with Escape", () => {
    const done = vi.fn();
    render(<CinematicIntro onDone={done} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(done).toHaveBeenCalledTimes(1);
  });
  it("bypasses animation for reduced motion", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const done = vi.fn();
    render(<CinematicIntro onDone={done} />);
    expect(done).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(8500));
    expect(done).toHaveBeenCalledTimes(1);
  });
});