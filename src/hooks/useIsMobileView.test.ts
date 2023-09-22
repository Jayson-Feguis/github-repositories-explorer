import { renderHook } from "@testing-library/react-hooks";

// To Test
import { useIsMobileView } from ".";
import { waitFor } from "@testing-library/react";

// Setup
const fireResize = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};

// Tests
describe("useIsMobileView Hook", () => {
  it("Should initialize values correctly", () => {
    const { result } = renderHook(() => useIsMobileView());

    expect(result.current).toBe(false);
  });
  it("Should return true if window size is less the or equal 768", async () => {
    const { result } = renderHook(() => useIsMobileView());

    await waitFor(() => {
      fireResize(768);
    });

    expect(result.current).toBe(true);
  });

  it("Should return false if window size is greater than 768", async () => {
    const { result } = renderHook(() => useIsMobileView());

    await waitFor(() => {
      fireResize(769);
    });

    expect(result.current).toBe(false);
  });
});
