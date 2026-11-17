import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTypewriter } from "@/hooks/use-typewriter";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("greeting typewriter", () => {
  it("starts promptly, reveals characters in order, and stops at the full greeting", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTypewriter(22));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(250));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(85));
    expect(result.current).toBe(2);
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current).toBe(22);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("shows the complete greeting immediately when reduced motion is requested", () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { result } = renderHook(() => useTypewriter(22));
    expect(result.current).toBe(22);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels pending typing when the greeting unmounts", () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useTypewriter(22));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});